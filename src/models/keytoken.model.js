/** @format */

"use strict";
const { randomUUID } = require("crypto");
const { Schema, model } = require("mongoose"); // Erase if already required

const DOCUMENT_NAME = "Key";
const COLLECTON_NAME = "Keys";
// Declare the Schema of the Mongo model
const KeyTokenSchema = new Schema(
  {
    tkn_userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Users",
    },
    tkn_clientId: {
      type: Schema.Types.UUID,
      default: () => randomUUID(),
      unique: true,
      index: true,
    },
    tkn_publicKey: {
      type: String,
      required: true,
    },
    tkn_privateKey: {
      type: String,
      required: true,
    },

    tkn_refreshTokensUsed: {
      // nhung RT da duoc su dung
      type: Array,
      default: [],
    }
  },
  {
    collection: COLLECTON_NAME,
    timestamps: true,
  }
);

// Export the model
module.exports = model(DOCUMENT_NAME, KeyTokenSchema);
