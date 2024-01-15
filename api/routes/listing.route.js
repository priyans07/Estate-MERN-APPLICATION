import express  from "express";
import { verifyUser } from "../utlis/verifiedUser.js";
import { createListing , deleteListing , updateListing, getListings ,getListing} from "../controllers/listing.controller.js";
const router=express.Router();
router.post('/create',verifyUser ,createListing);
router.delete('/delete/:id',verifyUser,deleteListing);
router.post('/update/:id',verifyUser,updateListing);
router.get('/get/:id',getListing)
router.get('/get',getListings);
export default router;