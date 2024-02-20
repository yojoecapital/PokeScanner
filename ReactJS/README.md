# Getting Started: ReactJS

1. Make sure you `cd` into the `ReactJS` directory
2. Use `npm install` to install everything for `package.json`
3. Use `npm start` to start the ReactJS application

- Note that the [Django server](../DjangoServer/README.md) should also be running to use the classification feature
- Depending on what the local host URL is, you may need to change some code in `DjangoServer` to make the API calls. Look at the README in `DjangoServer`. Check `DragDropFile.js` to make sure it is pointing to the right URL for the Django Server (the `fetch()` line in `handleFile()`).