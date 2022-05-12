const State = require('../model/State');
const statesonFile = require('../model/states.json');


//return all states
const getStates = async(req, res) => {
    let jsonStates, mongo;
    if(req?.query?.contig == 'true') {
        jsonStates = statesonFile.filter(
            (state) => state.code !== 'AK' && state.code !== 'HI'
        );
        mongo = await State.find();
    } else if(req?.query?.contig == 'false') {
        jsonStates = statesonFile.filter(
            (state) => state.code === 'AK' || state.code === 'HI'
        );
        mongo = await State.find();
    } else {
        jsonStates = JSON.parse(JSON.stringify(statesonFile));
        mongo = await State.find();
    }

    const states = combineSources(jsonStates, mongo);

    if(!states) {
        return res.status(204).json({message: 'No states'});
    }
    res.json(states);
};

//get specific state by statecode
const getSpecificState = async (req, res) => {
    const state = statesonFile.find((state) => state.code === req.params.state);
    const mongo = await State.find({statecode: req.params.state});
    const result = combineSources([state], mongo);
    res.json(result[0]);
};

//show capital city
const getStateCapital = async(req, res) => {
    const state = statesonFile.find((state) => state.code === req.params.state);
    res.json({
        state: state.state,
        capital: state.capital_city,
    });
};

//show state nickname
const getStateNickname = async(req, res) => {
    const state = statesonFile.find((state) => state.code === req.params.state);
    res.json({
        state: state.state,
        nickname: state.nickname,
    });
};

//show state population
const getStatePopulation = async(req, res) => {
    const state = statesonFile.find((state) => state.code === req.params.state);
    res.json({
        state: state.state,
        population: state.population.toLocaleString(),
    });
};

//show admission date
const getStateAdmission = async(req, res) => {
    const state = statesonFile.find((state) => state.code === req.params.state);
    res.json({
        state: state.state,
        admission_date: state.admission_date,
    });
};

//get random fun fact
const getFunFact = async (req, res) => {
    const state = await State.findOne({stateCode: req.params.state });
    const fact = state?.funfacts;

    if(!fact) {
        const stateName = statesonFile.find(
            (state) => state.code === req.params.state).state;
            res.json({message: `There's nothing fun about ${stateName}`});
    } else {
        const randomFact = fact[Math.floor(Math.random() * fact.length)];
        res.json({
            funfact: randomFact,
        });
    }
};

//create fun fact
const createFunFact = async (req, res) => {
    if(!req.body?.funfacts) {
        return res.status(400).json({message: 'Fun fact required'});
    }
    if(!Array.isArray(req.body.funfacts)) {
        return res.status(400).json({message: 'Fun facts must be saved in an array'});
    }
    const state = await State.findOne({stateCode: req.params.state }).exec();

    if(state) {
        state.funfacts.push(...req.body.funfacts);
        const result = await state.save();
        res.json(result);
    } else {
        try{
            const result = await State.create({
                stateCode: req.params.state,
                funfacts: [...req.body.funfacts],
            });
            res.status(201).json(result);
        } catch (error) {
            console.log(error);
        }
    }
};

//modify an existing fact
const modifyFact = async (req, res) => {
    const stateCode = req?.params?.state;
    const index = req?.body?.index;
    const funfact = req?.body?.funfact;

    if(!index) {
        return res.status(400).json({
            message: 'An index is required'
        });
    }
    if(!funfact) {
        return res.status(400).json({
            message: 'State has no fun facts'
        });
    }

    const state = await State.findOne({statecode: stateCode}).exec();

    if(!state) {
        const stateName = statesonFile.fine((state) => state.code === stateCode).state;
        res.json({message: `${stateName} is no fun at all`});
    } else if(!state.funfacts[index-1]) {
        const stateName = statesonFile.find((state) => state.code === stateCode).state;
    } else {
        state.funfacts[index0-1] = funfact;
        const result = await state.save();
        res.json(result);
    }
};

//delete a fun fact
const deleteFact = async (res, req) => {
    const stateCode = req?.params?.state;
    const index = req?.body?.index;

    if(!index) {
        return res.status(400).json({
            message: 'Index needed'
        });
    }
    const state = await State.findOne({stateCode: stateCode}).exec();

    if(!state) {
        const stateName = statesonFile.find((state) => state.code === stateCode).state;
        res.json({message: `${stateName} isn't fun`});
    } else if(!state.funfacts[index -1 ]) {
        const stateName = statesonFile.find((state) => state.code === stateCode).state;
        res.json({message: "Nothing at that index"});
    } else {
        state.funfacts.splice(index-1, 1);
        const result = await state.save();
        res.json(result);
    }
};

//show fun facts along with json info [not working]
const combineSources = (statesonFile, mongo) => {
    return statesonFile.map((states) => {
        const stateCode = states.code;
        let result = { ...states };
        const facts = mongo.find((state) => state.stateCode === stateCode);
        if(facts?.funfacts?.length > 0 && facts.funfacts !== []) {
            result.funfacts = facts.funfacts;
        }
        return result;
    });
};


module.exports = {getStates,
                getSpecificState,
                getStateCapital,
                getStateNickname,
                getStatePopulation,
                getStateAdmission,
                getFunFact,
                createFunFact,
                modifyFact,
                deleteFact};