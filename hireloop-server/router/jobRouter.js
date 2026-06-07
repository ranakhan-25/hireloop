const { ObjectId } = require("mongodb");
const { db } = require("../config/dbConfig");
const jobRouter = require("express").Router();

const jobCollection = db.collection("jobs");
const companyCollection = db.collection("company");

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
jobRouter.get("/api/jobs", async (req, res) => {
  try {
    const result = await jobCollection.find().toArray();
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
    console.log(result);
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
jobRouter.get("/api/company", async (req, res) => {
  try {
    const query = {};
    if (req.query.companyId) {
      query.recruiterId = req.query.companyId;
    }

    const result = await companyCollection.findOne(query);
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
