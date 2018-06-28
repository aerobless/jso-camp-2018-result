const config = {
    sample: {
        database: {
            connection: 'projectId:location:dbInstance',
            name: 'dbName',
            user: 'dbUser',
            password: 'dbPassword'
        }
    },
    production: {
        database: {
            connection: '',
            name: '',
            user: '',
            password: ''
        }
    }
};
module.exports = config;