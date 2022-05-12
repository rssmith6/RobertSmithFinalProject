const statesonFile = require('../model/states.json');

const verifyState = (req, res, next) => {
    const stateCode = req?.params?.state?.toUpperCase();

    if(!stateCode) {
        return res.status(400).json({message: "Invalid state code"});
    }

    const validStateCodes = statesonFile.map((state) => state.code);

    if(validStateCodes.indexOf(stateCode) !== -1) {
        req.params.state = stateCode;
        next();
    } else {
        res.status(400).json({message: "Invalid state code"});
    }
};

    module.exports = verifyState;