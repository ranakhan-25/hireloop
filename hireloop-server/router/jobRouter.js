const { ObjectId } = require("mongodb");
const { db, db_hireLoop } = require("../config/dbConfig");
const jobRouter = require("express").Router();

const jobCollection = db.collection("jobs");
const companyCollection = db.collection("company");
const userCollection = db_hireLoop.collection("user");
const applicationCollection = db_hireLoop.collection("application");
const plansCollection = db_hireLoop.collection("plans");
const subscriptionCollection = db_hireLoop.collection("subscription");



jobRouter.get("/api/plans", async (req, res) => {
  try {

    const query = {};
    if (req.query.planId) {
      query.id = req.query.planId;
    }
    const result = await plansCollection.findOne(query);

    if (!result) {
      return res.status(500).json({
      success: false,
      message: "plans is not successfully",
    });
    }
    return res.status(200).json({
      success: true,
      message: "plans are not successfully",
      payload: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
jobRouter.post("/api/subscription", async (req, res) => {
  try {
    const data = req.body;
    const result = await subscriptionCollection.insertOne(data);


    const filter = { email: data.email };
    const updateDocument = {
      $set: {
        email : data.email,
        plan:data.planId
      }
    }

    const updateResult = await userCollection.updateOne(filter, updateDocument);

    console.log(updateResult)

    if (!updateResult) {
      return res.status(500).json({
      success: false,
      message: "update is not successfully",
    });
    }

    return res.status(200).json({
      success: true,
      message: "update are not successfully",
      payload: updateResult,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
jobRouter.post("/api/application", async (req, res) => {
  try {
    const apply = req.body;
    const result = await applicationCollection.insertOne(apply);

    if (!result) {
      return res.status(500).json({
      success: false,
      message: "apply is not successfully",
    });
    }

    return res.status(200).json({
      success: true,
      message: "apply are not successfully",
      payload: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
jobRouter.get("/api/application", async (req, res) => {
  try {
    const query = {}
    if (req.query.applicantId) {
      query.applicantId = req.query.applicantId
    }
    if (req.query.jobId) {
      query.jobIdId = req.query.jobId
    }

    const cursor = applicationCollection.find(query);
    const result = await cursor.toArray();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "application not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "application found successfully",
      payload: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
jobRouter.get("/api/users", async (req, res) => {
  try {
    const cursor = userCollection.find();
    const result = await cursor.toArray();

    if (result.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Users not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Users found successfully",
      payload: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

jobRouter.get("/api/jobs", async (req, res) => {
  try {
    const query = {};
    if (req.query.companyId) {
      query.companyId = req.query.companyId;
    }
    if (req.query.status) {
      query.status = {
        $regex: `^${req.query.status}$`,
        $options: "i",
      };
    }

    const result = await jobCollection.find(query).toArray();
    
    if (!result) {
      return res.json({
        status: 500,
        message: "job is not found",
      });
    }
    res.json({
      status: 200,
      message: "jobs found successfully",
      payload: result,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
});
jobRouter.get("/api/jobs/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await jobCollection.findOne({_id:id});
    if (!result) {
      return res.json({
        status: 500,
        message: "job is not found",
      });
    }
    res.json({
      status: 200,
      message: "jobs found successfully",
      payload: result,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
});

jobRouter.get("/api/company", async (req, res) => {
  try {
    const query = {};
    if (req.query.recruiterId) {
      query.recruiterId = req.query.recruiterId;
    }

    const result = await companyCollection.find(query).toArray();
    if (!result) {
      return res.json({
        status: 500,
        message: "company is not found",
      });
    }
    res.json({
      status: 200,
      message: "company found successfully",
      payload: result,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
});
jobRouter.post("/api/jobs", async (req, res) => {
  try {
    const jobs = req.body;
    const result = await jobCollection.insertOne(jobs);
    if (!result) {
      return res.json({
        status: 500,
        message: "job is not inserted",
      });
    }
    res.json({
      status: 200,
      message: "job created successfully",
      payload: result,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
});
jobRouter.patch("/api/company/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await companyCollection.findOneAndUpdate({ _id: new ObjectId(id) }, {
      $set: {
      status:req.body.status
    }});
    if (!result) {
      return res.json({
        status: 500,
        message: "Company status updated not successfully",
      });
    }
    res.json({
      status: 200,
      message: "Company status updated successfully",
      payload: result,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
});
jobRouter.post("/api/company", async (req, res) => {
  try {
    const company = req.body;
    const result = await companyCollection.insertOne(company);
    if (!result) {
      return res.json({
        status: 500,
        message: "Company is not inserted",
      });
    }
    res.json({
      status: 200,
      message: "Company created successfully",
      payload: result,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
});
jobRouter.patch("/api/company", async (req, res) => {
  try {
    const { companyId } = req.query;

     if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "companyId is required",
      });
    }

    const data = req.body;
    const newData = {
      companyName: data.companyName,
      industry: data.industry,
      websiteUrl: data.websiteUrl,
      location: data.location,
      employeeCount: data.employeeCount,
      description: data.description,
      logo: data.logo,
    };

    const result = await companyCollection.findOneAndUpdate(
      { _id: new ObjectId(companyId) },
      {
        $set: newData,
      },
      {
        returnDocument: "after",
      },
    );
    if (!result) {
      return res.json({
        status: 500,
        message: "Company is not updated",
      });
    }
    res.json({
      status: 200,
      message: "Company updated successfully",
      payload: result,
    });
  } catch (error) {
    res.json({
      status: 500,
      message: error.message,
    });
  }
});

module.exports = jobRouter;
