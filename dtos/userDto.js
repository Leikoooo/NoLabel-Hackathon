module.exports = class UserDto {
    id;
    email;
    username;
    isActivated;
    constructor(model) {
        this.id = model.id;
        this.email = model.email;
        this.username = model.username;
        this.isActivated = model.isActivated; 
    }
}
