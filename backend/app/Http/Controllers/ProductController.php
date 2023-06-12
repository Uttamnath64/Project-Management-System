<?php

namespace App\Http\Controllers;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\Product;

class ProductController extends Controller
{
    // get list of products
    public function getProducts()
    {
        $response = [
            'success' => true,
            'message' => "Products retrieved successfully!",
            'result' => Product::where('user_id',Auth::id())->get()
        ];
        return response()->json($response,200);      
    }


    // create a new product
    public function createProduct(Request $request)
    {
        // validation
        $validator = Validator::make($request->all(),[
            'name'=>'required',
            'description'=>'required',
            'price'=>'required|numeric'
        ]);

        if($validator->fails()){

            $response = [
                'success' => false,
                'message' => $validator->errors()
            ];
            return response()->json($response,400);

        }else{

            $request['user_id'] = Auth::id();

            // create prodect 
            $product = Product::create($request->all());

            // set response
            $response = [
                'success' => true,
                'message' => "Product created successfully!",
            ];

            return response()->json($response,200);
        }
    }

    
    // view prodect by id
    public function viewProduct(string $id)
    {
        $product = Product::find($id);

        if($product){
            $response = [
                'success' => true,
                'message' => "Product retrieved successfully!",
                'result' => $product
            ];

            return response()->json($response,200);
        }else{
            
            $response = [
                'success' => false,
                'message' => "Product not found!"
            ];

            return response()->json($response,400);
        }

        // set response
    }

    
    // update product by id
    public function updateProduct(Request $request, string $id)
    {
        // validation
        $validator = Validator::make($request->all(),[
            'name'=>'required',
            'description'=>'required',
            'price'=>'required|numeric'
        ]);

        if(!$validator->fails()){

            $product = Product::where([
                'user_id' =>Auth::id(),
                'id' => $id
            ])->first();

            if($product){
                $product->update($request->all());

                $response = [
                    'success' => true,
                    'message' => "Product updated successfully!"
                ];

                return response()->json($response,200);
            }else{
                
                $response = [
                    'success' => true,
                    'message' => "Product not found!"
                ];

                return response()->json($response,400);
            }
        }else{
            $response = [
                'success' => false,
                'message' => $validator->errors()
            ];
            return response()->json($response,400);
        }
    }

    // delete product by id
    public function deleteProduct(string $id)
    {
        $product = Product::where([
            'user_id' =>Auth::id(),
            'id' => $id
        ])->first();

        if($product){
            $product->delete();
            $response = [
                'success' => true,
                'message' => "Product deleted successfully!"
            ];
            return response()->json($response,200);
        }else{
            $response = [
                'success' => false,
                'message' => "Product not found!"
            ];
            return response()->json($response,400);
        }
    }
}
