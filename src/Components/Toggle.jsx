import Proptypes from 'prop-types'

export const Toggle = ({onClick, text, checked}) => {

  return (
    <div>
      <label className="inline-flex items-center cursor-pointer">
        <input type="checkbox" value="" className="sr-only peer" checked={checked} onChange={onClick} />
        <div className="relative w-[40px] h-[20px] bg-[#E0A75E] peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#F5E7B2] peer-checked:peer-focus:ring-[#F9D689] rounded-full peer peer-checked:after:translate-x-[20px] rtl:peer-checked:after:-translate-x-[20px] after:content-[''] after:absolute after:top-[2.35px] after:start-[2px] after:bg-[#FEFFD2] peer-checked:after:bg-[#FFEEA9] after:border-2 after:border-orange-100 peer-checked:after:border-orange-200 after:rounded-full after:h-4 after:w-4 after:transition-al peer-checked:bg-[#973131] peer-hover:after:border-2 peer-hover:after:border-[#E0A75E] peer-checked:peer-hover:after:border-[#973131]">
        </div>
        <span className="ms-3 text-md font-medium text-[#76453B] peer-checked:text-[#E36414] font-arcade tracking-wider select-none">{text}</span>
    </label>
    </div>
  )
}

Toggle.propTypes = {
    onClick: Proptypes.func,
    text: Proptypes.string,
    checked: Proptypes.bool
}


