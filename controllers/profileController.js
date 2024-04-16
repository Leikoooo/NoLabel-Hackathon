const ApiError = require("../error/ApiError");
const { User, Comment, Portfolio, About, Contact, PriceList, Workstages, Cover, Header, Tags, Theme } = require("../models/models");
class ProfileController {
    async getProfile(req, res, next) {
        try {
            const { id } = req.query;
            const user = await User.findOne({ where: { id } });

            if (!user) {
                return next(ApiError.BadRequest('Пользователь не найден'));
            }

            const commentsDB = await Comment.findAll({ where: { user_id: id, is_deleted: false } });
            const portfolioDB = await Portfolio.findAll({ where: { user_id: id } });
            const aboutDB = await About.findOne({ where: { user_id: id } });
            const contactsDB = await Contact.findOne({ where: { user_id: id } });
            const priceListDB = await PriceList.findAll({ where: { user_id: id } });
            const workStagesDB = await Workstages.findAll({ where: { user_id: id } });
            const coverDB = await Cover.findOne({ where: { user_id: id } });
            const headerDB = await Header.findOne({ where: { user_id: id } });
            const tagsDB = await Tags.findAll({ where: { user_id: id } });
            const themeDB = await Theme.findOne({ where: { user_id: id } });



            const feedback = commentsDB.map(comment => {
                let user = User.findOne({ where: { id: comment.user_id } });
                return {
                    id: comment?.id,
                    user_id: comment?.user_id,
                    username: user?.username,
                    text: comment?.text,
                    rate: comment?.rating
                }
            });
            const portfolio = portfolioDB.map(port => {
                return {
                    id: port?.id,
                    image: port?.image,
                    title: port?.title,
                    subtitle: port?.subtitle
                }
            });

            const about = {
                id: aboutDB?.id,
                text: aboutDB?.text?.split('|'),
                credits: aboutDB?.credits,
                position: aboutDB?.position,
                image: aboutDB?.image
            }


            const contacts = {
                id: contactsDB?.id,
                tg: contactsDB?.tg,
                wa: contactsDB?.wa,
                phone: contactsDB?.phone,
                email: contactsDB?.email,
                vk: contactsDB?.vk,
                inst: contactsDB?.inst,
                address: contactsDB?.address,
                hours: contactsDB?.hours
            }

            const priceList = priceListDB.map(price => {
                return {
                    id: price?.id,
                    title: price?.title,
                    services: price?.services,
                    price: price?.price
                }
            }
            )

            const workStages = workStagesDB.map(work => {
                return {
                    id: work?.id,
                    label: work?.label,
                    description: work?.description
                }
            })

            const cover = {
                id: coverDB?.id,
                title: coverDB?.title,
                subtitle: coverDB?.subtitle
            }

            const header = {
                id: headerDB?.id,
                companyName: headerDB?.companyName
            }

            const tags = {
                id: tagsDB?.id,
                tags: tagsDB.map(tagObj => {
                    return tagObj.tag
                }
                )
            }

            const theme = {
                id: themeDB?.id,
                theme: themeDB?.theme
            }

            const data = {
                feedback,
                portfolio,
                about,
                contacts,
                priceList,
                workStages,
                cover,
                header,
                tags,
                theme
            }

            return res.json(data);
        } catch (e) {
            next(ApiError.BadRequest(e.message));
        }
    }

    async updateProfile(req, res, next) { }
    async addComment(req, res, next) { }
    async deleteComment(req, res, next) { }

    async editProfile(req, res, next) {
        try {
            const { user_id, contacts, feedback, portfolio, about, priceList, workStages, cover, header, tags, theme } = req.body;

            if (!user_id) {
                return next(ApiError.BadRequest('Не указан id пользователя'));
            }

            if (contacts) {
                const { tg, wa, phone, email, vk, inst, address, hours } = contacts;
                const contact = await Contact.findOne({ where: { user_id } });
                if (contact) {
                    contact.tg = tg ? tg : contact.tg;
                    contact.wa = wa ? wa : contact.wa;
                    contact.phone = phone ? phone : contact.phone;
                    contact.email = email ? email : contact.email;
                    contact.vk = vk ? vk : contact.vk;
                    contact.inst = inst ? inst : contact.inst;
                    contact.address = address ? address : contact.address;
                    contact.hours = hours ? hours : contact.hours;
                    await contact.save();
                } else {
                    const newContact = await Contact.create({ user_id, tg, wa, phone, email, vk, inst, address, hours });
                }
            }

            if (feedback) {

                const { id, text, rate, created_by } = feedback;
                const comment = await Comment.findOne({ where: { id: id } });
                if (comment) {
                    comment.text = text ? text : comment.text;
                    comment.rate = rate ? rate : comment.rate;
                    comment.created_by = created_by ? created_by : comment.created_by;
                    await comment.save();
                } else {
                    const newComment = await Comment.create({ user_id, text, rate, created_by });
                }

            }

            if (portfolio) {
                for (let i = 0; i < portfolio.length; i++) {
                    const { id, image, title, subtitle } = portfolio[i];
                    const port = await Portfolio.findOne({ where: { id } });
                    if (port) {
                        port.image = image ? image : port.image;
                        port.title = title ? title : port.title;
                        port.subtitle = subtitle ? subtitle : port.subtitle;
                        await port.save();
                    } else {
                        const newPort = await Portfolio.create({ user_id, image, title, subtitle });
                    }
                }
            }

            if (about) {
                const { text, credits, position, image } = about;
                const ab = await About.findOne({ where: { user_id } });
                if (ab) {
                    ab.text = text ? text : ab.text;
                    ab.credits = credits ? credits : ab.credits;
                    ab.position = position ? position : ab.position;
                    ab.image = image ? image : ab.image;
                    await ab.save();
                } else {
                    const newAb = await About.create({ user_id, text, credits, position, image });
                }
            }

            if (priceList) {
                for (let i = 0; i < priceList.length; i++) {
                    const { id, title, services, price } = priceList[i];
                    const priceDB = await PriceList.findOne({ where: { id } });
                    if (priceDB) {
                        priceDB.title = title ? title : priceDB.title;
                        priceDB.services = services ? services : priceDB.services;
                        priceDB.price = price ? price : priceDB.price;
                        await priceDB.save();
                    } else {
                        const newPrice = await PriceList.create({ user_id, title, services, price });
                    }
                }
            }

            if (workStages) {
                for (let i = 0; i < workStages.length; i++) {
                    const { id, label, description } = workStages[i];
                    const work = await Workstages.findOne({ where: { id } });
                    if (work) {
                        work.label = label ? label : work.label;
                        work.description = description ? description : work.description;
                        await work.save();
                    } else {
                        const newWork = await Workstages.create({ user_id, label, description });
                    }
                }
            }

            if (cover) {
                const { title, subtitle } = cover;
                const coverDB = await Cover.findOne({ where: { user_id } });
                if (coverDB) {
                    coverDB.title = title ? title : coverDB.title;
                    coverDB.subtitle = subtitle ? subtitle : coverDB.subtitle;
                    await coverDB.save();
                } else {
                    const newCover = await Cover.create({ user_id, title, subtitle });
                }
            }

            if (header) {
                const { companyName } = header;
                const headerDB = await Header.findOne({ where: { user_id } });
                if (headerDB) {
                    headerDB.companyName = companyName ? companyName : headerDB.companyName;
                    await headerDB.save();
                } else {
                    const newHeader = await Header.create({ user_id, companyName });
                }
            }

            if (tags) {

                const tagsDB = await Tags.findOne({ where: { user_id } });
                if (tagsDB) {
                    tagsDB.tags = tags ? tags : tagsDB.tags;
                    await tagsDB.save();
                } else {
                    const newTags = await Tags.create({ user_id , tags });
                }
            }

            if (theme) {
                const themeDB = await Theme.findOne({ where: { user_id } });
                if (themeDB) {
                    themeDB.theme = theme ? theme : themeDB.theme;
                    await themeDB.save();
                } else {
                    const newTheme = await Theme.create({ user_id, theme });
                }
            }
            return res.json({ message: 'Профиль успешно обновлен' });
        }
        catch (e) {
            next(ApiError.BadRequest(e.message));
        }
    }
}

module.exports = new ProfileController();