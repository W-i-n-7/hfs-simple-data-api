exports.version = 1.01
exports.apiRequired = 10.3
exports.repo = "W-i-n-7/hfs-simple-data-api"
exports.description = "Simple API that can provide and edit a string, If you do not have any APIs then stop the plugin (errors)"

exports.config = {
    apis: {
        type: 'array',
        label: 'Apis:',
        helperText: 'You can create multiple separate endpoints.',
        fields: {
            url: {
                type: 'string',
                label: 'URL',
                defaultValue: '/simple-data',
                helperText: 'URL that will used to provide/edit the stored string. It must start with a /'
            },
            accesspassword: {
                type: 'string',
                sm: 6,
                label: 'Access Password',
                defaultValue: '',
                helperText: 'Password required to *get* the stored string. If empty, no auth query is nessecary.\nQuery to use: "auth=Your_Password"'
            },
            editpassword: {
                type: 'string',
                sm: 6,
                label: 'Edit Password',
                defaultValue: 'CHANGEME',
                helperText: 'Password required *edit* the stored string. If empty, no auth query is nessecary.\nQuery to use: "auth=Your_Password"\n+ Query to edit: "text=New Text To Update"\nTo send special characters when editing use URL-Encoded values such as %0A for new-line (aka \\n)'
            },
            storedstring: {
                type: 'string',
                label: 'Stored data.',
                defaultValue: ' ',
                helperText: 'You can manually edit this, or use the URL to do so\nThis will be provided when the URL is accessed',
                multiline: true
            }
        }
    }
}

exports.configDialog = {
    maxWidth: false,
    sx: { minWidth: 'min(80em, 80vw)' },
}

exports.init = async api => {
    exports.middleware = ctx => {
        var confIndex = api.getConfig('apis').findIndex(item => item.url === ctx.path)
        if (confIndex !== -1) {
            if (ctx.query.text !== undefined)
            {
                var editpasswd = api.getConfig('apis')[confIndex].editpassword
                if (decodeURIComponent(ctx.query.auth) === editpasswd || editpasswd === '')
                {
                    // var array = api.getConfig('apis').slice() // Should be fixed in later release of HFS
                    var array = api.require('lodash').cloneDeep(api.getConfig('apis'))
                    array[confIndex].storedstring = ctx.query.text
                    api.setConfig('apis', array)
                    
                    ctx.body = 'OK'
                    ctx.satus = 200
                }
                
                return ctx.stop?.() || true
            }
            else
            {
                var passwd = api.getConfig('apis')[confIndex].accesspassword
                if (decodeURIComponent(ctx.query.auth) === passwd || passwd === '')
                {
                    ctx.body = api.getConfig('apis')[confIndex].storedstring
                    ctx.satus = 200
                }

                return ctx.stop?.() || true
            }
        }
    }
}
