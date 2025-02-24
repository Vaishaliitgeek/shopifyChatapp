import { Product } from "../../models/product.model"

export const loader=async({request})=>{
  try{
    const dbproduct=await Product.find({});
    console.log("dbproduct",dbproduct);
    return Response.json({dbproduct,status:200});
  }
  catch(error){
    console.error(error);
    return Response.json({message:"Error",status:500});
  }
}
