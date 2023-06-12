<?php

namespace App\Http\Controllers;
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use App\Models\User;


class AuthController extends Controller
{

    // register function
    function register(Request $request){

        // validation
        $validator = Validator::make($request->all(),[
            'name'=>'required',
            'email'=>'required|email',
            'password'=>'required|min:6',
            'c_password'=>'required|same:password'
        ]);

        if($validator->fails()){

            $response = [
                'success' => false,
                'message' => $validator->errors()
            ];
            return response()->json($response,400);

        }else{

            $findUser = User::where('email',$request->email)->first();

            if($findUser){
                $response = [
                    'success' => false,
                    'message' => "User already exists!"
                ];

                return response()->json($response,400);
            }

            // create account 
            $input = $request->all();
            $input['password'] = bcrypt($input['password']);
            $user = User::create($input);

            // set response
            $response = [
                'success' => true,
                'message' => "Account created successfully!",
                'result' => [
                    'token' => $user->createToken('UttamNath')->plainTextToken,
                    'name' => $user->name
                ]
            ];

            return response()->json($response,200);
        }
    }

    // login function
    function login(Request $request){

        // validation
        $validator = Validator::make($request->all(),[
            'email'=>'required|email',
            'password'=>'required|min:6'
        ]);

        if(!$validator->fails()){

            if(Auth::attempt([
                'email' => $request->email,
                'password' => $request->password
            ])){

                $user = Auth::user();

                // set response
                $response = [
                    'success' => true,
                    'message' => "Login successfully!",
                    'result' => [
                        'token' => $user->createToken('UttamNath')->plainTextToken,
                        'name' => $user->name
                    ]
                ];
                return response()->json($response,200);

            }else{

                $response = [
                    'success' => false,
                    'message' => "Unauthorised!"
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

    // login function 
    function logout(Request $request){

        // delete tokens
        auth()->user()->tokens()->delete();

        
        $response = [
            'success' => true,
            'message' => "Logout!"
        ];
        return response()->json($response,200);

    }
}
