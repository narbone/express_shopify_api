var express = require('express'),
    multer = require('multer'),
    fs = require('fs'),
    unzip = require('unzip'),
    path = require('path'),
    vinylFile = require('vinyl-file')

var shopifyConnector = require('shopify-connector'),
    shopify = shopifyConnector.getShopifyApiInstance('<your_shopify_API_key>', '<your_shopify_password>', '<your_shopify_shop_url>'),
    themeId='<your_shopify_shop_theme_id>',

    router = express.Router()

router.get('/', function(req, res, next) {
    res.send('About files service');
});

// Shopify Assets

router.get('/form_file_upload/shopify_assets', function(req, res, next) {
    res.render('shopify_assets', { title: 'Upload a Zip file on Shopify Assets dir' });
});

var uploadsDir = 'public/uploads';

if (!fs.existsSync(uploadsDir)){
    fs.mkdirSync(uploadsDir);
    console.log("created dir public/uploads");
}else
{
    console.log("uploads dir already exists");
}

var shopifyAssetsDir = 'public/uploads/shopify-assets';

if (!fs.existsSync(shopifyAssetsDir)){
    fs.mkdirSync(shopifyAssetsDir);
    console.log("created dir public/uploads/shopify-assets");
}else
{
    console.log("shopify-assets dir already exists");
}

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

var upload = multer({ storage: storage })

router.post('/shopify_assets', upload.single('upload'), function (req, res, next) {

    var destination = req.file.destination + '/shopify-assets'

    fs.createReadStream(req.file.path).pipe(unzip.Extract({ path: destination }).on('close',

        function () {

            var numOfFiles = fs.readdirSync(destination).length;

            fs.readdir(destination, function (err, files) {

                var count = 0;

                if (err) {
                    throw err;
                }

                files.map(function (file) {

                    return path.join(destination, file);

                }).filter(function (file) {

                    return fs.statSync(file).isFile();

                }).forEach(function (file) {

                    // console.log(file, path.basename(file));
                    var vinyl = vinylFile.readSync(file);

                    var props = {
                        asset: {
                            key: 'assets/' + path.basename(file),
                            attachment: vinyl.contents.toString('base64')
                        }
                    }

                    shopify.asset.update(themeId, props).then(
                        function (response) {
                            fs.unlink(file, function (err) {
                                if (err) {
                                    return console.error(err);
                                }
                                // res.send('empty', { message: path.basename(file) + ' uploded and successfully locally deleted !'});
                                console.log(path.basename(file), 'uploded and successfully locally deleted !');
                                count++;
                                if(count == numOfFiles)
                                    res.render('empty', { message: 'Done !' });
                            });
                        },
                        function (err) {
                            console.log('err ', err)
                        }
                    );
                });
            });
        }
    ));
})

module.exports = router;