const {User} = require('../models/models');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mailService');
const tokenService = require('./tokenService');
const UserDto = require('../dtos/userDto');
const ApiError = require('../error/ApiError');


class UserService {
    async registration(username, email, password) {
        const candidate = await User.findOne({ where: { email: email } });
        if (candidate) {
            throw ApiError.BadRequest(`Пользователь с почтовым адресом ${email} уже существует`);
        }
        const hashPassword = await bcrypt.hash(password, 3);
        const activationLink = uuid.v4();
        const user = await User.create({ username, email, password: hashPassword, activationLink });
        // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);
        
        const userDto = new UserDto(user);

        const tokens = tokenService.generateTokens({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refresh_token);

        return {
            ...tokens,
            user: userDto
        }
    }

    async activate(activationLink) {
        const user = await User.findOne({ where: {activationLink: activationLink } });
        if (!user) {
            throw ApiError.BadRequest('Неккоректная ссылка активации')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({email})
        if (!user) {
            throw ApiError.BadRequest('Пользователь с таким email не найден')
        }
        const isPassEquals = await bcrypt.compare(password, user.password);
        if (!isPassEquals) {
            throw ApiError.BadRequest('Неверный пароль');
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        console.log(userDto.id, tokens.refresh_token);
        await tokenService.saveToken(userDto.id, tokens.refresh_token);
        return {...tokens, user: userDto}
    }

    async logout(refresh_token) {
        const token = await tokenService.removeToken(refresh_token);
        return token;
    }

    async refresh(refresh_token) {
        if (!refresh_token) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refresh_token);
        const tokenFromDb = await tokenService.findToken(refresh_token);
        if (!userData || !tokenFromDb) {
            throw ApiError.UnauthorizedError();
        }
        const user = await User.findOne({ where: { id: userData.id } });
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refresh_token);
        return {...tokens, user: userDto}
    }

    async getUser(id) {
        const user = await User.findOne({ where: { id } });
        const userDto = new UserDto(user);
        return userDto;
    }
}

module.exports = new UserService();