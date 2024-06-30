const express = require("express");
const router = express.Router();
const asyncHandler = require("express-async-handler");
const Contact = require("../models/contactModel.js");
const validateToken = require("../middleware/validatetokenhandler.js");

router.use(validateToken);
// get all contacts
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const contacts = await Contact.find({ user_id: req.user.id });
    res.status(200).json(contacts);
  })
);

// get one contact
router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const contact = await Contact.findById(req.params.id);
    if (!contact) {
      res.status(404).json({ message: "Cannot find id" });
    }
    res.status(200).json(contact);
  })
);

// create a new contact
router.post(
  "/",
  asyncHandler(async (req, res) => {
    console.log(req.body);
    const { name, email, phone } = req.body;
    if (!name || !email || !phone) {
      return res.status(400).json({ message: "All fields are mandatory" });
    }
    const contact = await Contact.create({
      name,
      email,
      phone,
      user_id: req.user.id,
    });
    res.status(201).json(contact);
  })
);

// Update a contact by id
router.put(
  "/:id",
  asyncHandler(async (req, res) => {
    // Find the contact by the id in the request parameters
    const contact = await Contact.findById(req.params.id);
    // If the contact is not found, return a 404 status code with a message
    if (!contact) {
      res.status(404).json({ message: "Cannot find id" });
    }

    if (contact.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "User dont have permission to update other users contact",
      });
    }

    // Find the contact by the id in the request parameters and update it with the data in the request body
    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    // Return the updated contact with a 200 status code
    res.status(200).json(updatedContact);
  })
);

// Delete a contact by id
router.delete(
  "/:id",
  asyncHandler(async (req, res) => {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);

    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found" });
    }
    if (contact.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        message: "User dont have permission to delete other user contact",
      });
    }

    res.status(200).json({ message: `Deleted contact ${req.params.id}` });
  })
);

module.exports = router;
