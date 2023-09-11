import Carousel from 'react-material-ui-carousel';

const Example = (props) => {
  var items = [
    {
      src: "/images/ideogram.jpeg",

    },
    {
      src: "/images/ideogram1.jpeg",

    },
    {
      src: "/images/ideogram2.jpeg",

    },
    {
      src: "/images/imagen-manometros.jpg",

    }
  ]

  return (
    <Carousel sx={{
      backdropFilter: 'blur(10px)', // Aplicar un desenfoque de 10px al fondo
      background: 'rgba(255, 255, 25, 0.5)'
    }}>
      {
        items.map((item, i) => <img className="w-full" key={i} src={item.src} style={{
          maxWidth: '1320px', // Establece un máximo de ancho para la imagen
          maxHeight: '583px', // Establece un máximo de altura para la imagen
        }}/>)
      }
    </Carousel>
  )
}


export default Example