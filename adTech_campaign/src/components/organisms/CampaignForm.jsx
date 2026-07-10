import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { SelectField } from "../atoms/SelectField";
import { FormField } from "../molecules/FormField";

import { platformOptions, ageGroupOptions } from "../../data/campaignOptions";
import { CampaignContext } from "../../context/CampaignContextValue";

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
    status: editCampaign?.status || "Active",
  }));

  const [errors, setErrors] = useState({});

  function validate() {
    const newErrors = {};

    if (!campaign.campaignName.trim()) {
      newErrors.campaignName = "Campaign name is required.";
    }

    if (!campaign.platform) {
      newErrors.platform = "Please select a platform.";
    }

    if (!campaign.ageGroup) {
      newErrors.ageGroup = "Please select an age group.";
    }

    if (!campaign.budget) {
      newErrors.budget = "Budget is required.";
    } else if (Number(campaign.budget) <= 0) {
      newErrors.budget = "Budget must be greater than 0.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setCampaign({
      ...campaign,
      [name]: value,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!validate()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    const campaignData = {
      ...campaign,
      campaignName: campaign.campaignName.trim(),
      budget: Number(campaign.budget),
    };

    try {
      if (isEditMode) {
        updateCampaign(id, campaignData);
        toast.success("Campaign updated successfully.");
      } else {
        addCampaign(campaignData);
        toast.success("Campaign created successfully.");
      }

      setErrors({});
      navigate("/campaigns");
    } catch {
      toast.error(
        isEditMode
          ? "Unable to update campaign."
          : "Unable to create campaign."
      );
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
    >
      <FormField label="Campaign Name" htmlFor="campaignName">
        <Input
          id="campaignName"
          name="campaignName"
          value={campaign.campaignName}
          placeholder="Enter campaign name"
          onChange={handleChange}
          aria-invalid={Boolean(errors.campaignName)}
        />
        {errors.campaignName && (
          <p className="mt-1 text-sm font-medium text-red-600">
            {errors.campaignName}
          </p>
        )}
      </FormField>

      <FormField label="Platform" htmlFor="platform">
        <SelectField
          id="platform"
          name="platform"
          value={campaign.platform}
          onChange={handleChange}
          aria-invalid={Boolean(errors.platform)}
        >
          {platformOptions.map((platform) => (
            <option key={platform} value={platform}>
              {platform}
            </option>
          ))}
        </SelectField>
        {errors.platform && (
          <p className="mt-1 text-sm font-medium text-red-600">
            {errors.platform}
          </p>
        )}
      </FormField>

      <FormField label="Age Group" htmlFor="ageGroup">
        <SelectField
          id="ageGroup"
          name="ageGroup"
          value={campaign.ageGroup}
          onChange={handleChange}
          aria-invalid={Boolean(errors.ageGroup)}
        >
          {ageGroupOptions.map((ageGroup) => (
            <option key={ageGroup} value={ageGroup}>
              {ageGroup}
            </option>
          ))}
        </SelectField>
        {errors.ageGroup && (
          <p className="mt-1 text-sm font-medium text-red-600">
            {errors.ageGroup}
          </p>
        )}
      </FormField>

      <FormField label="Budget" htmlFor="budget">
        <Input
          type="number"
          id="budget"
          name="budget"
          value={campaign.budget}
          placeholder="Enter budget"
          onChange={handleChange}
          aria-invalid={Boolean(errors.budget)}
        />
        {errors.budget && (
          <p className="mt-1 text-sm font-medium text-red-600">
            {errors.budget}
          </p>
        )}
      </FormField>

      <Button type="submit" className="mt-2 w-full">
        {isEditMode ? "Update Campaign" : "Create Campaign"}
      </Button>
    </form>
  );
}
