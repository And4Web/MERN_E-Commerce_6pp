export const Skeleton = ({width = "unset"}:{width?: string}) => {
  return (
    <div className="skeleton-loader" style={{width}}>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
    </div>
  )
}


function Loader() {
  return (
    <div>Loading...</div>
  )
}

export default Loader

