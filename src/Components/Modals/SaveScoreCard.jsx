import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { saveScore } from '../../functions';
import { FE_URL } from '../../constants';

const SaveScoreCard = ({ closeCard, score }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const onSubmit = async ()=>{
    if (!username || !password) return alert("Enter all the fields");
    const isSaved = await saveScore(score, username, password);
    console.log(isSaved);
    if (isSaved) {
      closeCard();
      if (FE_URL) window.location.href = FE_URL;
    } else alert("Error saving score!!!");
  }
  return (
    <div className="w-full h-full flex justify-center items-center">
      <motion.div className="min-[820px]:w-[50%] w-[75%] h-[70vh]  max-sm:h-[60vh] max-sm:min-w-[350px] min-[820px]:h-[75%] max-h-[500px] bg-[#bfe8c2] border-2 border-[#80AF81] rounded-xl shadow-md shadow-[#254336] flex flex-col items-center"
        initial={{
          opacity: 0,
          scale: 0,
        }}
        animate={{
          opacity: 1,
          scale: [0 , 1]
        }}
        transition={{
          duration: 0.5,
          ease: 'easeInOut'
        }}
      >
        <div className="h-full flex flex-col items-center justify-center gap-6 pb-5 px-5">
          <div className="text-[#1A5319] text-5xl max-md:text-4xl w-full px-16 max-md:px-8 text-center font-kghappy text-wrap">Save Score</div>
          <div className="text-yellow-600 text-3xl max-md:text-2xl w-full px-16 text-center font-copyduck text-wrap">Score: <span className="text-amber-600">{score}</span></div>
          <input placeholder='User ID' className='py-4 max-md:py-2 rounded-lg bg-[#254336] caret-[#D6EFD8] px-5 w-full text-4xl plsceholder-[#80AF81] font-dpcomic text-[#D6EFD8] text-center focus:outline-4 outline-green-700 focus:shadow-inner shadow-green-950 shadow' onChange={(e)=>setUsername(e.target.value)} />
          <input placeholder='Password' className='py-4 max-md:py-2 rounded-lg bg-[#254336] caret-[#D6EFD8] px-5 w-full text-4xl font-dpcomic text-[#D6EFD8] text-center focus:outline-4 outline-green-700 focus:shadow-inner shadow-green-950 shadow' onChange={(e)=>setPassword(e.target.value)} />
          <button className='bg-[#80AF81] px-4 max-md:py-1 py-3 border-4 border-green-800 text-3xl rounded-xl font-copyduck text-[#254336] shadow-md active:shadow-none active:scale-95' onClick={onSubmit}>Submit</button>
        </div>
      </motion.div>
    </div>
  )
}

SaveScoreCard.propTypes = {
  closeCard: PropTypes.func.isRequired,
  score: PropTypes.number.isRequired
  
}

export default SaveScoreCard
