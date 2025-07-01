// import { useEffect, useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom'
// export default function TypingWords() {
//     const words = ['Hi', 'Welcome', 'to', 'The', 'Chat', 'Land'];
//     const [currentWordIndex, setCurrentWordIndex] = useState(0);
//     const [displayedWords, setDisplayedWords] = useState('');

//     useEffect(() => {
//         const interval = setInterval(() => {
//             setDisplayedWords((prev) => {
//                 if (currentWordIndex === 0) return words[0];
//                 return `${prev} ${words[currentWordIndex]}`;
//             });

//             setCurrentWordIndex((prev) => {
//                 if (prev + 1 >= words.length) {
//                     // Reset after full sentence is shown
//                     setTimeout(() => {
//                         setDisplayedWords('');
//                         setCurrentWordIndex(0);
//                     }, 500); // wait before restarting
//                     clearInterval(interval);
//                     return prev;
//                 }
//                 return prev + 1;
//             });
//         }, 300); // Delay between words

//         return () => clearInterval(interval);
//     }, [currentWordIndex]);

//     return (

//         <div className='min-w-100 max-w-auto'>
//             <div className=' h-full w-full p-6  shadow-md rounded-lg bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border border-gray-200'>
//                 <h1 className="text-2xl  text-center ">
//                     {displayedWords}
//                     <span className="animate-pulse">|</span></h1>
//                 <h1 className='text text-center mt-4 text-xl text-gray-300'> Your data is Secure With us </h1>
               
//                     <div>
//                          <div className='flex flex-row justify-center mt-4 gap-5 '><h1 className='text mt-2 text-center  text-gray-800 '>Already Have an Account</h1>
//                         <Link to="/login">
                            
//                                 <button className='btn btn-ghost'>Login</button>
//                         </Link>
                        
                    

//                 </div>
//                 <div className='flex flex-row justify-center mt-4 gap-5 '><h1 className='text mt-2 text-center  text-gray-800 '>Don't Have an Account</h1>
//                         <Link to="/register">
                            
//                                 <button className='btn btn-ghost'>Signup</button>
//                         </Link>
//                     </div>

//             </div>

//         </div >
// </div>

//     );
// }
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function TypingWords() {
  const words = ['Hi', 'Welcome', 'to', 'The', 'Chat', 'Land'];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedWords, setDisplayedWords] = useState('');

  useEffect(() => {
    if (currentWordIndex < words.length) {
      const timeout = setTimeout(() => {
        setDisplayedWords((prev) =>
          prev ? `${prev} ${words[currentWordIndex]}` : words[currentWordIndex]
        );
        setCurrentWordIndex((prev) => prev + 1);
      }, 300);
      return () => clearTimeout(timeout);
    } else {
      // restart after full sentence shown
      const resetTimeout = setTimeout(() => {
        setDisplayedWords('');
        setCurrentWordIndex(0);
      }, 1500);
      return () => clearTimeout(resetTimeout);
    }
  }, [currentWordIndex]);

  return (
    <div className="min-w-110 min-h-auto max-w-auto flex items-center justify-center bg to-purple-900 px-4">
      <div className="w-full max-w-md p-8 rounded-2xl shadow-2xl backdrop-blur-lg bg-white/10 border border-white/30">
        <h1 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-pink-400">
          {displayedWords}
          <span className="animate-pulse text-white">|</span>
        </h1>

        <h2 className=" font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-red-800 to-blue-800">Your data is Secure With Us</h2>

        <div className="space-y-4">
          <div className="flex justify-center items-center gap-2">
            <p className="text-gray-300">Already have an account?</p>
            <Link to="/login">
              <button className="btn btn-sm rounded-xl bg-white text-black hover:bg-gray-200 shadow-md">
                Login
              </button>
            </Link>
          </div>

          <div className="flex justify-center items-center gap-2">
            <p className="text-gray-300">Don't have an account?</p>
            <Link to="/register">
              <button className="btn btn-sm rounded-xl bg-white text-black hover:bg-gray-200 shadow-md">
                Signup
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
