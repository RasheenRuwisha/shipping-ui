"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [packages, setPackages] = useState([
    {
      length: 10,
      width: 10,
      height: 10,
      quantity: 10,
      packageType: "Skid",
      isCollapsed: false, // First package is expanded by default
    },
  ]);
  const { toast } = useToast();
  const [state, setState] = useState("");
  const [data, setData] = useState({});

  const [weight, setWeight] = useState("");
  const [checkboxes, setCheckboxes] = useState({
    liftGateTruck: false,
    offLoading: false,
    unpacking: false,
    insideDelivery: false,
    callAhead: false,
    debrisRemovalOnSite: false,
    dedicatedTruck: false,
    debrisRemovalOffSite: false,
    scheduledDelivery: false,
  });

  const handleInputChange = (index, e) => {
    const { name, value } = e.target;
    const updatedPackages = [...packages];
    updatedPackages[index][name] = value;
    setPackages(updatedPackages);
  };

  const handleCheckboxChange = (id, checked) => {
    setCheckboxes((prevState) => ({
      ...prevState,
      [id]: checked,
    }));
  };

  const handleAddPackage = () => {
    // Close all packages and open the new one
    setPackages([
      ...packages.map((pkg) => ({ ...pkg, isCollapsed: true })),
      {
        length: 10,
        width: 10,
        height: 10,
        quantity: 10,
        packageType: "Skid",
        isCollapsed: false, // New package is expanded
      },
    ]);
  };

  const handleRemovePackage = (index) => {
    const updatedPackages = packages.filter((_, i) => i !== index);
    setPackages(
      updatedPackages.length > 0
        ? updatedPackages
        : [{ ...updatedPackages[0], isCollapsed: false }]
    );
  };

  const toggleCollapse = (index) => {
    const updatedPackages = [...packages];
    updatedPackages[index].isCollapsed = !updatedPackages[index].isCollapsed;
    setPackages(updatedPackages);
  };

  // Function to handle the API request when "Get recommendation" is clicked
  const getRecommendation = async () => {
    // Prepare the data for the API request
    if (state == "") {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Enter the state",
      });
      return;
    }

    if (weight == "") {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Enter the weight",
      });
      return;
    }
    const requestData = {
      Currency: "CAD",
      Address: state.toUpperCase(),
      Length: packages.map((pkg) =>
        isNaN(parseFloat(pkg.length)) ? 0 : parseFloat(pkg.length)
      ),
      Width: packages.map((pkg) =>
        isNaN(parseFloat(pkg.width)) ? 0 : parseFloat(pkg.width)
      ),
      Height: packages.map((pkg) =>
        isNaN(parseFloat(pkg.height)) ? 0 : parseFloat(pkg.height)
      ),
      Weight: weight,
      Qty: packages.map((pkg) =>
        isNaN(parseFloat(pkg.quantity)) ? 0 : parseFloat(pkg.quantity)
      ),
      PackageType: packages[0]?.packageType,
      "LIFT-GATE TRUCK": checkboxes.liftGateTruck ? "Yes" : "No",
      "OFF-LOADING": checkboxes.offLoading ? "Yes" : "No",
      Unpacking: checkboxes.unpacking ? "Yes" : "No",
      "INSIDE DELIVERY": checkboxes.insideDelivery ? "Yes" : "No",
      "CALL AHEAD FOR APPT": checkboxes.callAhead ? "Yes" : "No",
      "Debris Removal – On-Site": checkboxes.debrisRemovalOnSite ? "Yes" : "No",
      "SCHEDULED DELIVERY": checkboxes.scheduledDelivery ? "Yes" : "No",
      "DEDICATED TRUCK": checkboxes.dedicatedTruck ? "Yes" : "No",
      "Debris Removal – Off-Site": checkboxes.debrisRemovalOffSite
        ? "Yes"
        : "No",
    };

    try {
      const response = await fetch(
        "https://shippingapi.rasheenruwisha.com/predict",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(requestData),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch recommendations");

      const responseData = await response.json();
      setData(responseData);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.error("Error fetching recommendation:", error);
    }
  };

  return (
    <div className="grid grid-rows-[20px_1fr_20px]  justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8  items-center sm:items-start">
        {/* Package Input Card */}
        <Card className="w-[80vw]">
          <CardHeader>
            <CardTitle>Add Package</CardTitle>
          </CardHeader>
          <CardContent>
            {packages.map((pkg, index) => (
              <div key={index} className="mb-5">
                <div className="flex justify-between items-center">
                  <h3
                    className="cursor-pointer font-medium"
                    onClick={() => toggleCollapse(index)}
                  >
                    {pkg.isCollapsed
                      ? `Package ${index + 1} (Hidden)`
                      : `Package ${index + 1} (Details)`}
                  </h3>
                  {packages.length > 1 && (
                    <Button
                      variant="outline"
                      onClick={() => handleRemovePackage(index)}
                      className="ml-4"
                    >
                      Remove Package
                    </Button>
                  )}
                </div>

                {!pkg.isCollapsed && (
                  <div className="grid grid-cols grid-rows-2 gap-5">
                    <div className="grid grid-cols-3 gap-5">
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor={`length-${index}`}>
                          Length (inches)
                        </Label>
                        <Input
                          type="number"
                          id={`length-${index}`}
                          name="length"
                          value={pkg.length}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Length"
                        />
                      </div>

                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor={`width-${index}`}>Width (inches)</Label>
                        <Input
                          type="number"
                          id={`width-${index}`}
                          name="width"
                          value={pkg.width}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Width"
                        />
                      </div>

                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor={`height-${index}`}>
                          Height (inches)
                        </Label>
                        <Input
                          type="number"
                          id={`height-${index}`}
                          name="height"
                          value={pkg.height}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Height"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor={`quantity-${index}`}>Quantity</Label>
                        <Input
                          type="number"
                          id={`quantity-${index}`}
                          name="quantity"
                          value={pkg.quantity}
                          onChange={(e) => handleInputChange(index, e)}
                          placeholder="Quantity"
                        />
                      </div>

                      <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor={`package-type-${index}`}>
                          Package Type
                        </Label>
                        <Select
                          id={`package-type-${index}`}
                          value={pkg.packageType}
                          onChange={(e) =>
                            handleInputChange(index, {
                              target: {
                                name: "packageType",
                                value: e.target.value,
                              },
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Package Type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="Skid">Skid</SelectItem>
                              <SelectItem value="Box">Box</SelectItem>
                              <SelectItem value="Crate">Crate</SelectItem>
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleAddPackage}>
              Add Another Package
            </Button>
          </CardFooter>
        </Card>

        {/* State and Weight Input Card */}
        <Card className="w-[80vw]">
          <CardHeader>
            <CardTitle>Destination State</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-5">
              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={"state"}>State</Label>
                <Input
                  type="text"
                  id={"state"}
                  name="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                />
              </div>

              <div className="grid w-full items-center gap-1.5">
                <Label htmlFor={"weight"}>Weight</Label>
                <Input
                  type="number"
                  id={"weight"}
                  name="weight"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Weight"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-5 mt-5">
              {/* ShadCN Checkboxes */}
              <div className="flex items-center gap-2">
                <Checkbox
                  id="lift-gate-truck"
                  checked={checkboxes.liftGateTruck}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("liftGateTruck", checked)
                  }
                />
                <Label htmlFor="lift-gate-truck">LIFT-GATE TRUCK</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="off-loading"
                  checked={checkboxes.offLoading}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("offLoading", checked)
                  }
                />
                <Label htmlFor="off-loading">OFF-LOADING</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="unpacking"
                  checked={checkboxes.unpacking}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("unpacking", checked)
                  }
                />
                <Label htmlFor="unpacking">Unpacking</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="inside-delivery"
                  checked={checkboxes.insideDelivery}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("insideDelivery", checked)
                  }
                />
                <Label htmlFor="inside-delivery">INSIDE DELIVERY</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="call-ahead"
                  checked={checkboxes.callAhead}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("callAhead", checked)
                  }
                />
                <Label htmlFor="call-ahead">CALL AHEAD FOR APPT</Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="debris-removal-on-site"
                  checked={checkboxes.debrisRemovalOnSite}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("debrisRemovalOnSite", checked)
                  }
                />
                <Label htmlFor="debris-removal-on-site">
                  Debris Removal – On-Site
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="dedicated-truck"
                  checked={checkboxes.dedicatedTruck}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("dedicatedTruck", checked)
                  }
                />
                <Label htmlFor="dedicated-truck">DEDICATED TRUCK</Label>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="default" onClick={getRecommendation}>
              Get Recommendation
            </Button>
          </CardFooter>
        </Card>

        {/* API Response Display Card */}
        {data && Object.keys(data).length > 0 && (
          <Card className="w-[80vw] mt-8">
            <CardHeader>
              <CardTitle>Recommendation Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <h3 className="font-bold">Historical Match</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Request</TableHead>
                      <TableHead>Carrier Name</TableHead>
                      <TableHead>Cost</TableHead>
                      <TableHead>State</TableHead>
                      <TableHead>Width</TableHead>
                      <TableHead>Height</TableHead>
                      <TableHead>Length</TableHead>
                      <TableHead>Weight</TableHead>
                      <TableHead>Package Type</TableHead>
                      <TableHead>Qty</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.historical_match.map((match, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          {match["REQ#"]}
                        </TableCell>
                        <TableCell>{match.Carrier}</TableCell>
                        <TableCell>{match.Cost}</TableCell>
                        <TableCell>{match.State}</TableCell>
                        <TableCell>{match.Width}</TableCell>
                        <TableCell>{match.Height}</TableCell>
                        <TableCell>{match.Length}</TableCell>
                        <TableCell>{match.Weight}</TableCell>
                        <TableCell>{match["Package Type"]}</TableCell>
                        <TableCell>{match.Qty}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              <div className="mt-10">
                <h3 className="font-bold">Top Carriers</h3>
                <div className="mt-10">
                  <div className="flex gap-10 mb-4">
                    {" "}
                    {/* Adds margin to the bottom */}
                    <div className="flex flex-col">
                      <p className="text-xs">Carrier</p>
                      <p className="text-4xl">
                        {data.top_carriers[0]?.Carrier}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs">Cost</p>
                      <p className="text-4xl">
                        {data.top_carriers[0]?.["Predicted Cost"].toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs">Total Shipments</p>
                      <p className="text-4xl">
                        {data.top_carriers[0]["Total Shipments"]}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs">Max Cost</p>
                      <p className="text-4xl">
                        {data.top_carriers[0]["Max Cost"]}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs">Max Weight</p>
                      <p className="text-4xl">
                        {data.top_carriers[0]["Max Weight"]}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs">Min Cost</p>
                      <p className="text-4xl">
                        {data.top_carriers[0]["Min Cost"]}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs">Min Weight</p>
                      <p className="text-4xl">
                        {data.top_carriers[0]["Min Weight"]}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs">Avg Cost</p>
                      <p className="text-4xl">
                        {data.top_carriers[0]["Avg Cost"].toFixed(2)}
                      </p>
                    </div>
                    <div className="flex flex-col">
                      <p className="text-xs">Avg Weight</p>
                      <p className="text-4xl">
                        {data.top_carriers[0]["Avg Cost"].toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-10 mt-10">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Carrier Name</TableHead>
                          <TableHead>Predicted Cost</TableHead>
                          <TableHead>Total Shipments</TableHead>
                          <TableHead>Max Cost</TableHead>
                          <TableHead>Max Weight</TableHead>
                          <TableHead>Min Cost</TableHead>
                          <TableHead>Min Weight</TableHead>
                          <TableHead>Avg Cost</TableHead>
                          <TableHead>Avg Weight</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {data.top_carriers.slice(1).map((carrier, index) => (
                          <TableRow key={index}>
                            <TableCell>{carrier.Carrier}</TableCell>
                            <TableCell>
                              {carrier?.["Predicted Cost"].toFixed(2)}
                            </TableCell>
                            <TableCell>{carrier["Total Shipments"]}</TableCell>
                            <TableCell>{carrier["Max Cost"]}</TableCell>
                            <TableCell>{carrier["Max Weight"]}</TableCell>
                            <TableCell>{carrier["Min Cost"]}</TableCell>
                            <TableCell>{carrier["Min Weight"]}</TableCell>
                            <TableCell>
                              {carrier["Avg Cost"].toFixed(2)}
                            </TableCell>
                            <TableCell>
                              {carrier["Avg Weight"].toFixed(2)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
}
