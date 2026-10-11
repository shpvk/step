export class GetUserResDto {
  id: number;
  email: string;
  fullname: string;
  is_block: boolean;
  address: string | null;
  city_id: number | null;
}
