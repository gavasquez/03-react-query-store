import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ProductCard, useProduct } from "..";


export const ProductById = () => {

  const { id } = useParams();

  const { product, isLoading } = useProduct( { id: +id! } );

  useEffect( () => {
    window.scrollTo( 0, 0 );
  }, [] );


  return (
    <div className="flex-col">
      <h1 className="text-2xl font-bold">Producto</h1>

      {
        isLoading && ( <span>Cargando...</span> )
      }

      {
        product && <ProductCard product={ product } fullDescription={ true } />
      }

    </div>
  );
};