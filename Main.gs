// main entry point to run the integrations - trigger fires this function daily
function main() {
  append_polar_row();
  populate_intervals_wellness_data();
  populate_intervals_sheet_csv();
}
