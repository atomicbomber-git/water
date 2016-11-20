var electron = require("electron");
var ipcMain = electron.ipcMain;
var app = electron.app;

var BrowserWindow = electron.BrowserWindow;
var mainWindow = null;




/* The Sequelize class */
const Sequelize = require("sequelize");

/* The supposed instance of the Sequelize class */
let sequelize = null;

/* Model classes */
let Item = null;

function initApp()
{
    /* Initialize ORM */
    sequelize = new Sequelize("lawar", "root", "alohomora", {
        host: "localhost",
        dialect: "mysql",
        pool: {
            max: 5,
            min: 0,
            idle: 10000
        }
    });

    /* Initialize model(s) */
    Item = sequelize.define("items", {
        name: {
            type: Sequelize.STRING,
            field: "name"
        }
    },
        {   
            timestamps: false,
            freezeTableName: true
        } 
    );
}

app.on("ready", function () {
    mainWindow = new BrowserWindow({
        height: 480,
        width: 640
    });

    initApp();

    ipcMain.on("pulldata", function(event, arg) {
        
        Item.findAll().then(function (items) {
            event.sender.send("datapulled", items);
        });

    });

    

    mainWindow.loadURL("file://" + __dirname + "/app/html/index.html");
});