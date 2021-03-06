"use strict";

const mongoose = require("mongoose")
    , forEach = require("iterate-object")
    , setOrGet = require("set-or-get")
    , oneByOne = require("one-by-one")
    , requireDir = require("require-dir")
    , ul = require("ul")
    , path = require("path")
    ;

mongoose.Promise = global.Promise;

const BloggifyMongoose = exports;

/**
 * @name bloggify:init
 * @param {Object} config
 *
 *  - `uri` (String): The database url.
 *  - `models` (Object): An object containing the Mongoose models.
 *  - `models_dir` (String): The relative path to a directory containing models stored in files.
 *
 * The model objects can be accessed by requiring the module or accessing the `Bloggify.models` object.
 */
BloggifyMongoose.init = (config, ready) => {
    BloggifyMongoose.uri = config.uri;
    Bloggify.db = mongoose

    let models = BloggifyMongoose.models = Bloggify.models;

    if (config.uri) {
        mongoose.connect(config.uri, ready);
        mongoose.connection.on("error", err => Bloggify.log(err));
    } else {
        return ready(new Error("Please provide a MongoDB URI in the `db` field of the config."));
    }

    if (config.models_dir) {
        config.models_dir = path.resolve(Bloggify.paths.root, config.models_dir);
        config.models = ul.merge(config.models, requireDir(config.models_dir));
    }

    forEach(config.models, (model, name) => {
        if (typeof model !== "function") {
            model = Bloggify.db.model(name, model)
        }
        Bloggify.models[name] = model
    });
};
