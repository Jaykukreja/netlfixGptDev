const axios = require("axios")
const fs = require('fs');
const { PDFDocument } = require('pdf-lib');
const url = "http://rendering.documents.cimpress.io/v1/docrefpreview/preview?width=1000&instructions_uri=https%3A%2F%2Fuds.documents.cimpress.io%2Fv2%2Fmerchants%2Fz106N6iyLUrEtq3161jYES103mmVjc2G%2540clients%2Fdocuments%2Fe886347f-4ea7-4a8c-818f-fed19ca7a63c%2Finstructions%3Ftoken%3D6d637315555b19f41f8dae02ef681085%26type%3Dpreview%26productDataSource%3DDocument&scene=https%3A%2F%2Fscenes.documents.cimpress.io%2Fv3%2Ftransient%3Fdata%3D%257B%2522width%2522%253A1000%252C%2522page%2522%253A1%252C%2522showFullBleed%2522%253Atrue%252C%2522product%2522%253A%257B%2522sku%2522%253A%2522CIM-4KC88KAJ%2522%252C%2522skuVariables%2522%253A%257B%2522Print%2520Process%2522%253A%2522Litho%2522%252C%2522Sides%2520Printed%2522%253A%2522Double%2520Sided%2522%252C%2522Booklet%2522%253A%2522None%2522%252C%2522Service%2520Level%2522%253A%2522Saver%2522%252C%2522Flat%2520Size%2520Y%2522%253A%2522210%2522%252C%2522Size%2522%253A%2522A5%2522%252C%2522Drilling%2522%253A%2522None%2522%252C%2522Samples%2522%253A%2522No%2522%252C%2522Finished%2520Size%2520X%2522%253A%2522148%2522%252C%2522Round%2520Corners%2522%253A%2522None%2522%252C%2522Flat%2520Size%2520X%2522%253A%2522148%2522%252C%2522Starting%2520Number%2522%253A%25220%2522%252C%2522Finished%2520Size%2522%253A%2522N%252FA%2522%252C%2522Spot%2520Uv%2522%253A%2522None%2522%252C%2522Paper%2520Type%2522%253A%2522130gsm%2520Art%2520Paper%2520Gloss%2520Finish%2522%252C%2522Cover%2520Material%2522%253A%2522None%2522%252C%2522Numbering%2522%253A%2522No%2522%252C%2522Die%2520Cutting%2522%253A%2522None%2522%252C%2522Sets%2522%253A%25221%2522%252C%2522Folding%2522%253A%2522None%2522%252C%2522Perforating%2522%253A%2522No%2522%252C%2522Add%2520Envelopes%2522%253A%2522None%2522%252C%2522Lamination%2522%253A%2522None%2522%252C%2522Finished%2520Size%2520Y%2522%253A%2522210%2522%252C%2522Product%2520Group%2522%253A%2522Flyers%2522%252C%2522Timed%2520Deliveries%2522%253A%2522Yes%2522%252C%2522Business%2520Card%2520Slits%2522%253A%2522No%2522%252C%2522Production%2520Time%2522%253A%25220%2522%252C%2522Banding%2522%253A%25220%2522%252C%2522Substrate%2520Weight%2522%253A%2522130%2522%252C%2522Substrate%2520Thickness%2522%253A%252291%2522%252C%2522Number%2520of%2520Creases%2522%253A%25220%2522%252C%2522Pagecount%2522%253A%25222%2522%252C%2522Primary%2520Folds%2522%253A%25220%2522%252C%2522Secondary%2520Folds%2522%253A%25220%2522%257D%257D%252C%2522layers%2522%253A%255B%257B%2522type%2522%253A%2522overlay%2522%252C%2522source%2522%253A%2522fold%2522%252C%2522stroke%2522%253A%257B%2522color%2522%253A%2522rgb(0%252C%2520255%252C%25200)%2522%252C%2522dotted%2522%253Atrue%257D%257D%255D%257D";

// callUrl(url)


// async function callUrl(url) {
//     const res = await axios.get(url)
//     console.log(res.data)
// }
// const axios = require("axios");
// const fs = require('fs');
// const { PDFDocument } = require('pdf-lib');

async function callUrl(url) {
    try {
        const res = await axios.get(url, { responseType: 'arraybuffer' });
        const bufferData = Buffer.from(res.data, 'binary');
        const contentType = res.headers['content-type'];
        console.log("res",res)

        // Create a new PDFDocument
        const pdfDoc = await PDFDocument.create();
        
        // Add a page to the document
        const page = pdfDoc.addPage([1000, 1000]); // Adjust size as needed

        let embeddedImage;
        if (contentType === 'image/png') {
            // Embed PNG image
            embeddedImage = await pdfDoc.embedPng(bufferData);
        } else if (contentType === 'image/JPEG') {
            // Embed JPEG image
            console.log("ji")
            embeddedImage = await pdfDoc.embedJpg(bufferData);
        } else {
            throw new Error(`Unsupported content type: ${contentType}`);
        }

        const { width, height } = embeddedImage.scale(0.5);

        // Draw the image onto the page
        page.drawImage(embeddedImage, {
            x: 0,
            y: 0,
            width,
            height,
        });

        // Save the PDF to a file
        const pdfBytes = await pdfDoc.save();
        fs.writeFileSync('output.pdf', pdfBytes);
        console.log('PDF created successfully');
    } catch (error) {
        console.error('Error creating PDF:', error);
    }
}

callUrl(url);
