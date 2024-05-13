import React from 'react'

const InpageNavigation = ({ Routes }) => {
  return (
    <div>
        {
            Routes.map(route => (
                <button>
                    { route }
                </button>
            ))
        }
    </div>
  )
}

export default InpageNavigation