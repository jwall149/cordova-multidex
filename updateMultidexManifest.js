module.exports = function(ctx) {
    var fs = require('fs'),
        path = require('path'),
        xml = ctx.requireCordovaModule('cordova-common').xmlHelpers;

    //manifest path of cordova-android@7+ projects
    var manifestPath = path.join(ctx.opts.projectRoot, 'platforms/android/app/src/main/AndroidManifest.xml');
    
    if (!fs.existsSync(manifestPath)) {
        //fall back to legacy manifest path
        manifestPath = path.join(ctx.opts.projectRoot, 'platforms/android/AndroidManifest.xml');
    }
    
    var doc = xml.parseElementtreeSync(manifestPath);
    if (doc.getroot().tag !== 'manifest') {
        throw new Error(manifestPath + ' has incorrect root node name (expected "manifest")');
    }

    //adds the tools namespace to the root node
    // doc.getroot().attrib['xmlns:tools'] = 'http://schemas.android.com/tools';
    //add tools:replace in the application node
    doc.getroot().find('./application').attrib['android:name'] = 'android.support.multidex.MultiDexApplication';

    //write the manifest file
    fs.writeFileSync(manifestPath, doc.write({indent: 4}), 'utf-8');
};
