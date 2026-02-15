{ pkgs, ... }:

{ 
  # Which nixpkgs channel to use.
  channel = "stable-23.11"; # Or "unstable"
  # Use https://search.nixos.org/packages to find packages.
  packages = [ 
    pkgs.nodejs_20
    pkgs.nodePackages.npm
  ];
  # Sets environment variables in the workspace.
  env = {};
  # Search for the starship package in nixpkgs
  # and enable it.
  # starship = {
  #   enable = true;
  #   # You can also use a custom config file
  #   # config = "";
  # };
  # Enable previews
  previews = {
    enable = true;
    previews = [
      {
        # The primary server
        command = ["npm" "run" "dev"];
        manager = "web";
        id = "web";
      }
    ];
  };
}