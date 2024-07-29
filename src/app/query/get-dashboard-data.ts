import Pg from '../../infra/repository/db/pg';

export class GetDashboardData {
  constructor(private pg: Pg) {}

  async execute() {
    const result = await this.pg.query(`
      SELECT 
      (SELECT COUNT(*) FROM farm_owners) AS total_farms,
      (SELECT SUM(total_farm_area_hectares) FROM farm_owners) AS total_farm_area,
      JSON_AGG(state_farm_counts) AS farms_by_state,
      JSON_AGG(crop_area_counts) AS area_by_crop,
      (SELECT SUM(arable_area_hectares) FROM farm_owners) AS total_arable_area,
      (SELECT SUM(vegetation_area_hectares) FROM farm_owners) AS total_vegetation_area
    FROM (
      SELECT state, COUNT(*) AS farm_count 
      FROM farm_owners 
      GROUP BY state
    ) AS state_farm_counts,
    (
      SELECT crop_name, SUM(area_hectares) AS total_area 
      FROM planted_crop 
      GROUP BY crop_name
    ) AS crop_area_counts;  
    `);
    return result.rows[0];
  }
}
