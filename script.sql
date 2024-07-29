CREATE TABLE IF NOT EXISTS farm_owners (
  id uuid PRIMARY KEY, 
  register_number varchar, 
  name varchar, 
  city varchar, 
  state varchar, 
  farm_name varchar, 
  total_farm_area_hectares bigint, 
  arable_area_hectares bigint, 
  vegetation_area_hectares bigint
);

CREATE TABLE IF NOT EXISTS planted_crop (
  id uuid PRIMARY KEY, 
  farm_id uuid REFERENCES farm_owners(id), 
  area_hectares bigint, 
  crop_name varchar
);


INSERT INTO farm_owners (id, register_number, name, city, state, farm_name, total_farm_area_hectares, arable_area_hectares, vegetation_area_hectares)
VALUES ('c4f6763c-9814-488f-9d6e-c0d11876cc68', '99091813040', 'John Doe', 'São Paulo', 'SP', 'Doe Farm', 100, 50, 50);

INSERT INTO planted_crop (id, farm_id, area_hectares, crop_name)
VALUES ('54890c22-c265-4f61-a0c4-58b87982ca09', 'c4f6763c-9814-488f-9d6e-c0d11876cc68', 50, 'Algodão');
