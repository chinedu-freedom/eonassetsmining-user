const https = require('https');

function findAudio() {
  https.get('https://polychainapp.com/spin-wheel', (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
      // Find audio in HTML
      const audioUrls = data.match(/[^"'>]+?\.(mp3|wav|ogg|m4a)/g);
      console.log('Audio URLs in HTML:', audioUrls);

      // Find JS files to scan
      const jsUrls = data.match(/[^"'>]+?\.js/g);
      if (jsUrls) {
        jsUrls.forEach(jsUrl => {
          if (!jsUrl.startsWith('http')) {
            if (jsUrl.startsWith('/')) {
              jsUrl = 'https://polychainapp.com' + jsUrl;
            } else {
              jsUrl = 'https://polychainapp.com/' + jsUrl;
            }
          }
          
          https.get(jsUrl, (jsRes) => {
            let jsData = '';
            jsRes.on('data', c => jsData += c);
            jsRes.on('end', () => {
              const audioInJs = jsData.match(/[^"'>]+?\.(mp3|wav|ogg|m4a)/g);
              if (audioInJs && audioInJs.length > 0) {
                console.log('Audio in', jsUrl, ':', audioInJs);
              }
            });
          }).on('error', () => {});
        });
      }
    });
  }).on('error', console.error);
}

findAudio();
