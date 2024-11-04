import doctorModel from "../Models/doctor.Model.js"


export const changeAvailability=async(req,res)=>{
    try {
      const {docId}=req.body
      const docData=await doctorModel.findById(docId)
      await doctorModel.findByIdAndUpdate(docId,{available:!docData.available})
      res.json({success:true, message:"Doctor availability changed successfully"})
    } catch (error) {
        res.json({success:false,message:error.message})
    }

}