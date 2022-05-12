const express = require("express");
const router = express();
const stateController = require("../../controllers/stateController");
const verifyState = require("../../middleware/verifyState");

router.route("/").get(stateController.getStates);

router.route("/:state").get(verifyState, stateController.getSpecificState);

router.route("/:state/capital").get(verifyState, stateController.getStateCapital);

router.route("/:state/nickname").get(verifyState, stateController.getStateNickname);

router.route("/:state/population").get(verifyState, stateController.getStatePopulation);

router.route("/:state/admission").get(verifyState, stateController.getStateAdmission);

router.route("/:state/funfact")
                .post(verifyState, stateController.createFunFact)
                .get(verifyState, stateController.getFunFact)
                .patch(verifyState, stateController.modifyFact)
                .delete(verifyState, stateController.deleteFact);

module.exports = router;