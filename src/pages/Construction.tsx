import construction from '../assets/images/construct.jpg'


let styles = {

  img: {
    height: '300px',
    width: '500px',
    margin: '0 auto',
    borderRadius: '12px'

  },
  div: {
    width: '500px',
    height: '300px',
    margin: '0 auto'
  }
}

let Construction = () => {
  return (
    <div style={styles.div}><img style={styles.img} src={construction} /></div>
  )
}

export default Construction;
