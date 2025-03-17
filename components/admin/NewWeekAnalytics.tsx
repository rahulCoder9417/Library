import { ArrowDown, ArrowUp } from "lucide-react";

interface Props{
    rate:String;
    number:number
}
const GrowthChecker = ({rate,number}:Props) =>{
    if (rate==="growth"){
        return(
            <span className='text-green-600 flex flex-row '>
            <ArrowUp/>
            {number}
            </span>
        )
    }else{
        return(
            <span className='text-red-600 flex'>
            <ArrowDown/>
            {number}
            </span>
        )
    }
}
const NewWeekAnalytics = () => {
  return (
    <div className='bg-white rounded-lg flex flex-col gap-10 p-4 flex-1'>
        <section className='flex items-center justify-between'>
            <p className='text-lg text-slate-400'>Borrowed Books</p><GrowthChecker rate={"growth"} number={5} />
        </section>
        <h1>05</h1>
    </div>
  )
}

export default NewWeekAnalytics