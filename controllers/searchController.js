
const ApiError = require("../error/ApiError");
const { User, Tags} = require("../models/models");

class searchController {
    async searchByTag(req, res, next) {

        async function getTags(user_id) {
            const tags1 = await Tags.findAll({
                where: {
                    user_id
                }
            })
            return tags1;
        }

        try {
            const { tag } = req.query;
            let tagsDB = [];
            let result = [];
            if (!tag) {
                tagsDB = await User.findAll();
                for (let i = 0; i < tagsDB.length; i++) {
                    const user = {"id": tagsDB[i].id, "username": tagsDB[i].username};
                    const tagsmas = await getTags(tagsDB[i].id);
                    const tags = tagsmas.map(t => t.tag)
                    result.push({user, tags});
                }
            } else {
                tagsDB = await Tags.findAll({
                    where: {
                        tag
                    }, include: [{model: User, attributes: ['id', 'username']}]
                });

                for (let i = 0; i < tagsDB.length; i++) {
                    const user = tagsDB[i].user;
                    const tagsmas = await getTags(user.id);
                    const tags = tagsmas.map(t => t.tag)
                    result.push({user, tags});
                }
            }

            return res.json(result);
        } catch (e) {
            next(ApiError.BadRequest(e.message));
        }
    }
}

module.exports = new searchController();