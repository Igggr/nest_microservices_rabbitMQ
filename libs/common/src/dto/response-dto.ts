import { HttpStatus } from "@nestjs/common";
import { ApiProperty, ApiResponseProperty } from "@nestjs/swagger";

export type ResponseDTO<T> = ErrorDTO | ValueDTO<T>; 

export class ErrorDTO {
    @ApiProperty({example: 'error', description: 'Код'})
    status: 'error';

    @ApiProperty({ description: 'Сообщение об ощибке'})
    error: string;    
}

export class ValueDTO<V> {
    @ApiProperty({ example: 'ok', description: 'Код' })
    status: 'ok';

    value: V;
}

export class AuthDTO {
    id: number;
    email: string;
    login: string;
    roles: string[];
}

export class TokenResponse extends ValueDTO<string> {
    @ApiProperty({
        description: 'jwt-токен',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IkpvaG5AbWFpbC5jb20iLCJpZCI6MTYsInJvbGVzIjpbIlVTRVIiXSwiaWF0IjoxNjgxMTQyMTUzLCJleHAiOjE2ODEyMjg1NTN9.TrdC0d1LTO7xY-zWuNCZozRXZvqzfb6UDDCbkbq-ANU'
    })
    value: string;
}

export class ForbidenResponse {
    @ApiProperty({ description: 'Код статуса', example: HttpStatus.FORBIDDEN })
    statusCode: 403;

    @ApiProperty({ example: 'Forbidden resource' })
    message: 'Forbidden resource';
    
    @ApiProperty({ example: 'Forbidden' })
    error: 'Forbidden';
};

export const SWAGGER_FORBIDDEN_RESPONSE = { status: HttpStatus.FORBIDDEN, type: ForbidenResponse };

export const SWAGGER_USER_ID_PARAM = {
    name: 'userId',
    description: 'Id пользователя, должно существовать в БД. Соответсвует user.id (profile.userId), а не его profile.id',
    example: 1,
};
