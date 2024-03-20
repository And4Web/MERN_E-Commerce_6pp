function Loader() {
  return (
    <div>Loading...</div>
  )
}

export default Loader

export const Skeleton = () => {
  return (
    <div className="skeleton-loader">
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
      <div className="skeleton-shape"></div>
    </div>
  )
}