
function validate_at_abn(abn, debug=false) {
    const faOffices = {
        '03': { office: 'Wien 3/6/7/11/15 Schwechat Gerasdorf', region: 'Wien' },
        '04': { office: 'Wien 4/5/10', region: 'Wien' },
        '06': { office: 'Wien 8/16/17', region: 'Wien' },
        '07': { office: 'Wien 9/18/19 Klosterneuburg', region: 'Wien' },
        '08': { office: 'Wien 12/13/14 Purkersdorf', region: 'Wien' },
        '09': { office: 'Wien 1/23', region: 'Wien' },
        '10': { office: 'für Gebühren, Verkehrsteuern und Glücksspiel', region: '' },
        '12': { office: 'Wien 2/20/21/22', region: 'Wien' },
        '15': { office: 'Amstetten Melk Scheibbs', region: 'Niederösterreich' },
        '16': { office: 'Baden Mödling', region: 'Niederösterreich' },
        '18': { office: 'Gänserndorf Mistelbach', region: 'Niederösterreich' },
        '22': { office: 'Hollabrunn Korneuburg Tulln', region: 'Niederösterreich' },
        '23': { office: 'Waldviertel', region: 'Niederösterreich' },
        '29': { office: 'Lilienfeld St. Pölten', region: 'Niederösterreich' },
        '33': { office: 'Neunkirchen Wr. Neustadt', region: 'Niederösterreich' },
        '38': { office: 'Bruck Eisenstadt Oberwart', region: 'Burgenland, Niederösterreich' },
        '41': { office: 'Braunau Ried Schärding', region: 'Oberösterreich' },
        '46': { office: 'Linz', region: 'Oberösterreich' },
        '51': { office: 'Kirchdorf Perg Steyr', region: 'Oberösterreich' },
        '52': { office: 'Freistadt Rohrbach Urfahr', region: 'Oberösterreich' },
        '53': { office: 'Gmunden Vöcklabruck', region: 'Oberösterreich' },
        '54': { office: 'Grieskirchen Wels', region: 'Oberösterreich' },
        '57': { office: 'Klagenfurt', region: 'Kärnten' },
        '59': { office: 'St. Veit Wolfsberg', region: 'Kärnten' },
        '61': { office: 'Spittal Villach', region: 'Kärnten' },
        '65': { office: 'Bruck Leoben Mürzzuschlag', region: 'Steiermark' },
        '67': { office: 'Oststeiermark', region: 'Steiermark' },
        '68': { office: 'Graz-Stadt', region: 'Steiermark' },
        '69': { office: 'Graz-Umgebung', region: 'Steiermark' },
        '71': { office: 'Judenburg Liezen', region: 'Steiermark' },
        '72': { office: 'Deutschlandsberg Leibnitz Voitsberg', region: 'Steiermark' },
        '81': { office: 'Innsbruck', region: 'Tirol' },
        '82': { office: 'Kitzbühel Lienz', region: 'Tirol' },
        '83': { office: 'Kufstein Schwaz', region: 'Tirol' },
        '84': { office: 'Landeck Reutte', region: 'Tirol' },
        '90': { office: 'St. Johann Tamsweg Zell am See', region: 'Salzburg' },
        '91': { office: 'Salzburg-Stadt', region: 'Salzburg' },
        '93': { office: 'Salzburg-Land', region: 'Salzburg' },
        '97': { office: 'Bregenz', region: 'Vorarlberg' },
        '98': { office: 'Feldkirch', region: 'Vorarlberg' }
      };
    
  
      const officeCode = abn.substring(0, 2);
      if (!faOffices.hasOwnProperty(officeCode)) {
          if (debug) { 
              console.log("Invalid component");
          }
          return false;
      }
  
      let sum = 0;
      for (let i = 0; i < 7; i++) {
          const digit = parseInt(abn[i + 2], 10); // Skip the first two characters (office code)
          sum += (i % 2 === 1 ? [0, 2, 4, 6, 8, 1, 3, 5, 7, 9][digit] : digit);
      }
  
      const checkDigit = String((10 - (sum % 10)) % 10);
      if (abn[9] !== checkDigit) {
          if (debug) { 
              console.log("Invalid checksum");
          }
          return false;
      }
  
      return true;
  }

  async function online_check(tin,debug=false) {
    const axios = require('axios');
    
    // Extract the relevant portion of the TIN (excluding the msCode)
    const processedTin = tin.substring(2);
    
    try {
        const response = await axios.post('https://ec.europa.eu/taxation_customs/tin/rest-api/tinRequest', {
            msCode: 'AT',
            tinNumber: processedTin
        });

        if (response.status !== 200) {
            if (debug) console.log(`Request failed with status: ${response.status}`);
            return false;
        }

        const data = response.data;
        if (data.result.structureValid === true && data.result.syntaxValid === true) {
            return true;
        }

        if (data.result.userError !== "0" || data.result.error === true || data.result.structureValid === false || data.result.syntaxValid === false) {
            if (debug) {
                console.log('Response Data:', data.result);
                if (data.result.userError !== "0") console.log(`User Error with code: ${data.result.userError}`);
                if (data.result.error === true) console.log('Error flag set to true in response');
                if (data.result.structureValid === false) console.log('Structure validity check failed');
                if (data.result.syntaxValid === false) console.log('Syntax validity check failed');
            }
            return false;
        }
    } catch (error) {
        if (debug) console.log('Axios request error:', error);
        console.error(error);
        return false;
    }
}


  module.exports = { validate_at_abn,online_check, online_check };
  
