import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { SelectField } from "../atoms/SelectField";
import { FormField } from "../molecules/FormField";

import {
  platformOptions,
  ageGroupOptions,
} from "../../data/campaignOptions";

import { CampaignContext } from "../../context/CampaignContext";

export function CampaignForm() {
  const { campaigns, addCampaign, updateCampaign } = useContext(CampaignContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const editCampaign = campaigns.find((campaign) => campaign.id === id);
  const isEditMode = Boolean(id);

  const [campaign, setCampaign] = useState(() => ({
    campaignName: editCampaign?.campaignName || editCampaign?.name || "",
    platform: editCampaign?.platform || "Facebook",
    ageGroup: editCampaign?.ageGroup || "All",
    budget: editCampaign?.budget || "",
  }));

  useEffect(() => {
    if (editCampaign) {
      setCampaign({
        campaignName: editCampaign.campaignName || editCampaign.name || "",
        platform: editCampaign.platform,
        ageGroup: editCampaign.ageGroup,
        budget: editCampaign.budget,
      });
    }
  }, [editCampaign]);

  function handleChange(event) {
    const { name, value } = event.target;

    setCampaign({
      ...campaign,
      [name]: value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    

    if (campaign.campaignName.trim()===""){
      alert("Please enter campaign name.");
      return;
    }
    if (campaign.budget.trim()===""){
      alert("Please enter budget.");
      return;
    }
    const campaignData = {
      ...campaign,
      budget: Number(campaign.budget),
    };

    if (isEditMode) {
      updateCampaign(id, campaignData);
      alert("Campaign Updated Successfully!");
    } else {
      addCampaign(campaignData);
      alert("Campaign Created Successfully!");
    }

    setCampaign({
      campaignName: "",
      platform: "Facebook",
      ageGroup: "All",
      budget: "",
    });

    navigate("/campaigns");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      

      <FormField
        label="Campaign Name"
        htmlFor="campaignName"
      >
        <Input
          id="campaignName"
          name="campaignName"
          value={campaign.campaignName}
          placeholder="Enter campaign name"
          onChange={handleChange}
          required
        />
      </FormField>

      <FormField
        label="Platform"
        htmlFor="platform"
      >
        <SelectField
          id="platform"
          name="platform"
          value={campaign.platform}
          onChange={handleChange}
        >
          {platformOptions.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </SelectField>
      </FormField>

      <FormField
        label="Age Group"
        htmlFor="ageGroup"
      >
        <SelectField
          id="ageGroup"
          name="ageGroup"
          value={campaign.ageGroup}
          onChange={handleChange}
        >
          {ageGroupOptions.map((ageGroup) => (
            <option key={ageGroup} value={ageGroup}>
              {ageGroup}
            </option>
          ))}
        </SelectField>
      </FormField>

      <FormField
        label="Budget"
        htmlFor="budget"
      >
        <Input
          type="number"
          id="budget"
          name="budget"
          value={campaign.budget}
          placeholder="Enter budget"
          onChange={handleChange}
          required
        />
      </FormField>

      <Button
        type="submit"
        className="mt-2 w-full"
      >
        {isEditMode ? "Update Campaign" : "Create Campaign"}
      </Button>
    </form>
  );
}
