import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';
import {isURL} from 'validator';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  app.get( "/filteredimage", async (req, res) => {

    const imgURL = req.query.image_url;

    if (!imgURL) {
      return res.status(400).send("URL missing");
    } else if (!isURL(imgURL)) {
      return res.status(400).send("URL not correct");
    }

    return filterImageFromURL(imgURL).then( (imgPath) => {
      res.status(200);
      res.sendFile(imgPath);
      res.on('finish', () => deleteLocalFiles([imgPath]));
    })
    .catch( (err) => {
      res.status(500).send("Server error");
    })
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();