const sequelize = require('../db');
const { DataTypes } = require('sequelize');

const User = sequelize.define('user', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false},
    password: { type: DataTypes.STRING, allowNull: false },
    avatar: { type: DataTypes.STRING, defaultValue: 'default.png' },
    status: { type: DataTypes.STRING, defaultValue: 'active' },
    role: { type: DataTypes.STRING, defaultValue: 'user' },
    rating: { type: DataTypes.INTEGER, defaultValue: 0 },
    isActivated: { type: DataTypes.BOOLEAN, defaultValue: false },
    activationLink: { type: DataTypes.STRING },
});

const Comment = sequelize.define('comment', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    text: { type: DataTypes.STRING, allowNull: false },
    rating: { type: DataTypes.INTEGER, allowNull: false },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
});

const Token = sequelize.define('token', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    refresh_token: { type: DataTypes.STRING, allowNull: false },
});

const Portfolio = sequelize.define('portfolio', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    image: { type: DataTypes.STRING, defaultValue: 'default.png' },
    title: {type: DataTypes.STRING},
    subtitle: {type: DataTypes.STRING}
});

const About = sequelize.define('about', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    text: {type: DataTypes.STRING},
    credit: {type: DataTypes.STRING},
    position: {type: DataTypes.STRING},
    image: { type: DataTypes.STRING, defaultValue: 'default.png' },
});

const Contact = sequelize.define('contact', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    tg: {type: DataTypes.STRING},
    wa: {type: DataTypes.STRING},
    phone: {type: DataTypes.STRING},
    email: {type: DataTypes.STRING},
    vk: {type: DataTypes.STRING},
    insta: {type: DataTypes.STRING},
    address: {type: DataTypes.STRING},
    hours: {type: DataTypes.STRING},
});

const PriceList = sequelize.define('pricelist', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    title: {type: DataTypes.STRING},
    services: {type: DataTypes.STRING},
    price: {type: DataTypes.STRING}
});

const Workstages = sequelize.define('workstages', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    label: {type: DataTypes.STRING},
    description: {type: DataTypes.STRING},
});

const Cover = sequelize.define('cover', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    title: {type: DataTypes.STRING},
    subtitle: {type: DataTypes.STRING},
});

const Header = sequelize.define('header', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    companyName: {type: DataTypes.STRING},
});

const Theme = sequelize.define('theme', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    theme: {type: DataTypes.STRING},
});

const Tags = sequelize.define('tag', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    tag: {type: DataTypes.STRING},
});

User.hasOne(Token, { foreignKey: 'user_id' });
Token.belongsTo(User, { foreignKey: 'user_id' });

Comment.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Comment, { foreignKey: 'user_id' });

Portfolio.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Portfolio, { foreignKey: 'user_id' });

About.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(About, { foreignKey: 'user_id' });

Contact.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Contact, { foreignKey: 'user_id' });

PriceList.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(PriceList, { foreignKey: 'user_id' });

Workstages.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Workstages, { foreignKey: 'user_id' });

Cover.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Cover, { foreignKey: 'user_id' });

Header.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Header, { foreignKey: 'user_id' });

Theme.belongsTo(User, { foreignKey: 'user_id' });
User.hasOne(Theme, { foreignKey: 'user_id' });

Tags.belongsTo(User, { foreignKey: 'user_id' });
User.hasMany(Tags, { foreignKey: 'user_id' });

module.exports = {
    User,
    Token,
    Comment,
    Portfolio,
    About,
    Contact,
    PriceList,
    Workstages,
    Cover,
    Header,
    Theme,
    Tags
}
