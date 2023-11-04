import { useQueryClient } from "@tanstack/react-query";
import { productActions } from '..';


export const usePrefetchProduct = () => {

  const queryCliente = useQueryClient();

  const prefecthProduct = ( id: number ) => {
    queryCliente.prefetchQuery(
      {
        queryKey: [ "product", id ],
        queryFn: () => productActions.getProductByid( id ),
      }
    );
  };

  return prefecthProduct;
};