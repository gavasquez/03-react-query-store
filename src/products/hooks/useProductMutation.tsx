import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Product, productActions } from '..';

export const useProductMutation = () => {
  //* permite todo el acceso 
  const queryCliente = useQueryClient();

  const mutation = useMutation({
    mutationFn: productActions.createProduct,
    onMutate: (product) => {
      console.log(product);
      const optimisticProdcut = { id: Math.random(), ...product };
      console.log(optimisticProdcut);
      //* Almacenar el producto en el cache del query client
      queryCliente.setQueryData<Product[]>(["products", { "filterKey": product.category }],
        (old) => {
          if (!old) return [optimisticProdcut];
          return [...old, optimisticProdcut];
        });
      return {
        optimisticProdcut
      }
    },
    onSuccess: (product, variables, context) => {
      console.log({ product, variables, context });

      queryCliente.removeQueries(
        {
          queryKey: ["products", context?.optimisticProdcut.id]
        }
      );
      // todo agregar la data sin tener que realizar otra peticion
      queryCliente.setQueryData<Product[]>(
        ["products", { "filterKey": product.category }],
        //* en el old se recibe el valor anterior
        (old) => {
          if (!old) return [product];
          return old.map(cacheProduct => {
            return cacheProduct.id === context?.optimisticProdcut.id ? product : cacheProduct;
          })
        }
      );

      //* Invalidar la data para que se dispare despues
      /* console.log( 'Producto creado.' );
      queryCliente.invalidateQueries( { queryKey: [ "products", { "filterKey": data.category } ] } ); */
    },
    onError: (error, variables, context) => {
      queryCliente.removeQueries(
        {
          queryKey: ["products", context?.optimisticProdcut.id]
        }
      );

      queryCliente.setQueryData<Product[]>(
        ["products", { "filterKey": variables.category }],
        //* en el old se recibe el valor anterior
        (old) => {
          if (!old) return [];
          return old.filter(cacheProduct => {
            return cacheProduct.id !== context?.optimisticProdcut.id;
          })
        }
      );
    },
    //* Se ejecuta despues del onSuccess
    /* onSettled: () => {
      console.log( 'on Settle' );
    } */
  });

  return mutation;
};