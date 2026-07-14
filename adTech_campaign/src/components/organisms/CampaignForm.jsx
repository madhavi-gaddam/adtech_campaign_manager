import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { CampaignContext } from "../../context/CampaignContextValue";
import { ageGroupOptions, platformOptions } from "../../data/campaignOptions";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { SelectField } from "../atoms/SelectField";
import { FormField } from "../molecules/FormField";

const MAX_NAME_LENGTH = 30;
const MAX_BUDGET = 100_000_000;

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-sm font-medium text-red-600">{error}</p>;
}

export function CampaignForm() {
  const { campaigns, addCampaign, updateCampaign } = useContext(CampaignContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const editCampaign = campaigns.find((campaign) => campaign.id === id);
  const isEditMode = Boolean(id);
  const [values, setValues] = useState({
    campaignName: editCampaign?.campaignName || editCampaign?.name || "",
    platform: editCampaign?.platform || "",
    ageGroup: editCampaign?.ageGroup || "",
    budget: editCampaign?.budget || "",
  });
  const [errors, setErrors] = useState({});

  function validate() {
    const nextErrors = {};
    const campaignName = values.campaignName.trim();
    const budget = Number(values.budget);

    if (!campaignName) {
      nextErrors.campaignName = "Campaign name is required.";
    } else if (campaignName.length > MAX_NAME_LENGTH) {
      nextErrors.campaignName = `Campaign name cannot exceed ${MAX_NAME_LENGTH} characters.`;
    } else if (campaigns.some((campaign) =>
      campaign.id !== id &&
      String(campaign.campaignName || campaign.name || "").trim().toLowerCase() === campaignName.toLowerCase()
    )) {
      nextErrors.campaignName = "A campaign with this name already exists.";
    }

    if (!values.platform) nextErrors.platform = "Please select a platform.";
    if (!values.ageGroup) nextErrors.ageGroup = "Please select an age group.";

    if (!values.budget) {
      nextErrors.budget = "Budget is required.";
    } else if (!Number.isFinite(budget) || budget <= 0) {
      nextErrors.budget = "Budget must be greater than 0.";
    } else if (budget > MAX_BUDGET) {
      nextErrors.budget = `Budget cannot exceed ₹${MAX_BUDGET.toLocaleString("en-IN")}.`;
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleChange(event) {
    const { name, value } = event.target;
    setValues((currentValues) => ({ ...currentValues, [name]: value }));
    setErrors((currentErrors) => ({ ...currentErrors, [name]: undefined }));
  }

  function onSubmit(event) {
    event.preventDefault();
    if (!validate()) return;

    const campaignValues = {
      ...values,
      campaignName: values.campaignName.trim(),
      budget: Number(values.budget),
    };

    try {
      if (isEditMode) {
        updateCampaign(id, campaignValues);
        toast.success("Campaign updated successfully.");
      } else {
        addCampaign(campaignValues);
        toast.success("Campaign created successfully.");
      }
      navigate("/campaigns");
    } catch (error) {
      toast.error(error.message || (isEditMode ? "Unable to update campaign." : "Unable to create campaign."));
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6" noValidate>
      <FormField label="Campaign Name" htmlFor="campaignName">
        <Input
          id="campaignName"
          name="campaignName"
          value={values.campaignName}
          onChange={handleChange}
          placeholder="Enter campaign name"
          maxLength={MAX_NAME_LENGTH}
          aria-invalid={Boolean(errors.campaignName)}
        />
        <p className="mt-1 text-right text-xs text-gray-500">
          {values.campaignName.length}/{MAX_NAME_LENGTH} characters
        </p>
        <FieldError error={errors.campaignName} />
      </FormField>

      <FormField label="Platform" htmlFor="platform">
        <SelectField id="platform" name="platform" value={values.platform} onChange={handleChange} aria-invalid={Boolean(errors.platform)}>
          <option value="" disabled>Select platform</option>
          {platformOptions.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
        </SelectField>
        <FieldError error={errors.platform} />
      </FormField>

      <FormField label="Age Group" htmlFor="ageGroup">
        <SelectField id="ageGroup" name="ageGroup" value={values.ageGroup} onChange={handleChange} aria-invalid={Boolean(errors.ageGroup)}>
          <option value="" disabled>Select age group</option>
          {ageGroupOptions.map((ageGroup) => <option key={ageGroup} value={ageGroup}>{ageGroup}</option>)}
        </SelectField>
        <FieldError error={errors.ageGroup} />
      </FormField>

      <FormField label="Budget" htmlFor="budget">
        <Input
          type="number"
          id="budget"
          name="budget"
          value={values.budget}
          onChange={handleChange}
          placeholder="Enter budget in rupees"
          min="1"
          max={MAX_BUDGET}
          step="1"
          aria-invalid={Boolean(errors.budget)}
        />
        <FieldError error={errors.budget} />
      </FormField>

      <Button type="submit" className="mt-2 w-full">
        {isEditMode ? "Update Campaign" : "Create Campaign"}
      </Button>
    </form>
  );
}
