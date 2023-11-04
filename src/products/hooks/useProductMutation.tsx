import { useMutation, useQueryClient } from '@tanstack/react-query';
import { productActions } from '..';

export const useProductMutation = () => {
  //* permite todo el acceso 
  const queryCliente = useQueryClient();

  const mutation = useMutation( {
    mutationFn: productActions.createProduct,
    onSuccess: ( data ) => {
      console.log( 'Producto creado.' );
      queryCliente.invalidateQueries( { queryKey: [ "products", { "filterKey": data.category } ] } );
    },
    //* Se ejecuta despues del onSuccess
    /* onSettled: () => {
      console.log( 'on Settle' );
    } */
  } );

  return mutation;
};