class User
{
    constructor(userId, forename, surname, accessCode, permissions)
    {
        if (userId)
        {
            this.id = userId;
        }
        else
        {
            //TODO generate ID
        }

        this.forename = forename;
        this.surname = surname;

        if (accessCode) {
            this.accessCode = accessCode;
        }
        else
        {
            //TODO set access code
        }
    }
}