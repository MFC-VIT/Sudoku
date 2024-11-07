import PropTypes from "prop-types"

const Modal = ({children}) => {
  return (
    <div className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-full backdrop-blur-sm">
      {children}
    </div>
  )
}

Modal.propTypes = {
  children: PropTypes.element.isRequired
}

export default Modal
