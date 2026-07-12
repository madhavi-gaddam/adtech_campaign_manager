import { zodResolver } from "@hookform/resolvers/zod";
import { useContext } from "react";
import { useForm, useWatch } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";

import { CampaignContext } from "../../context/CampaignContextValue";
import { ageGroupOptions, platformOptions } from "../../data/campaignOptions";
import { Button } from "../atoms/Button";
import { Input } from "../atoms/Input";
import { SelectField } from "../atoms/SelectField";
import { FormField } from "../molecules/FormField";

const MAX_NAME_LENGTH = 30;
const MAX_BUDGET = 100_000_000;

function createCampaignSchema(campaigns, currentId) {
  return z.object({
    campaignName: z.string()
      .trim()
      .min(1, "Campaign name is required.")
      .max(MAX_NAME_LENGTH, `Campaign name cannot exceed ${MAX_NAME_LENGTH} characters.`)
      .refine(
        (name) => !campaigns.some((campaign) =>
          campaign.id !== currentId &&
          String(campaign.campaignName || campaign.name || "").trim().toLowerCase() === name.toLowerCase()
        ),
        "A campaign with this name already exists."
      ),
    platform: z.string().min(1, "Please select a platform."),
    ageGroup: z.string().min(1, "Please select an age group."),
    budget: z.coerce.number({ error: "Budget is required." })
      .positive("Budget must be greater than 0.")
      .max(MAX_BUDGET, `Budget cannot exceed ₹${MAX_BUDGET.toLocaleString("en-IN")}.`),
  });
}

function FieldError({ error }) {
  if (!error) return null;
  return <p className="mt-1 text-sm font-medium text-red-600">{error.message}</p>;
}

export function CampaignForm() {
  const { campaigns, addCampaign, updateCampaign } = useContext(CampaignContext);
  const navigate = useNavigate();
  const { id } = useParams();
  const editCampaign = campaigns.find((campaign) => campaign.id === id);
  const isEditMode = Boolean(id);
  const schema = createCampaignSchema(campaigns, id);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: {
      campaignName: editCampaign?.campaignName || editCampaign?.name || "",
      platform: editCampaign?.platform || "",
      ageGroup: editCampaign?.ageGroup || "",
      budget: editCampaign?.budget || "",
    },
  });
  const campaignNameLength = useWatch({ control, name: "campaignName" })?.length || 0;

  function onSubmit(values) {
    try {
      if (isEditMode) {
        updateCampaign(id, values);
        toast.success("Campaign updated successfully.");
      } else {
        addCampaign(values);
        toast.success("Campaign created successfully.");
      }
      navigate("/campaigns");
    } catch (error) {
      toast.error(error.message || (isEditMode ? "Unable to update campaign." : "Unable to create campaign."));
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6" noValidate>
      <FormField label="Campaign Name" htmlFor="campaignName">
        <Input
          id="campaignName"
          placeholder="Enter campaign name"
          maxLength={MAX_NAME_LENGTH}
          aria-invalid={Boolean(errors.campaignName)}
          {...register("campaignName")}
        />
        <p className="mt-1 text-right text-xs text-gray-500">
          {campaignNameLength}/{MAX_NAME_LENGTH} characters
        </p>
        <FieldError error={errors.campaignName} />
      </FormField>

      <FormField label="Platform" htmlFor="platform">
        <SelectField id="platform" aria-invalid={Boolean(errors.platform)} {...register("platform")}>
          <option value="" disabled>Select platform</option>
          {platformOptions.map((platform) => <option key={platform} value={platform}>{platform}</option>)}
        </SelectField>
        <FieldError error={errors.platform} />
      </FormField>

      <FormField label="Age Group" htmlFor="ageGroup">
        <SelectField id="ageGroup" aria-invalid={Boolean(errors.ageGroup)} {...register("ageGroup")}>
          <option value="" disabled>Select age group</option>
          {ageGroupOptions.map((ageGroup) => <option key={ageGroup} value={ageGroup}>{ageGroup}</option>)}
        </SelectField>
        <FieldError error={errors.ageGroup} />
      </FormField>

      <FormField label="Budget" htmlFor="budget">
        <Input
          type="number"
          id="budget"
          placeholder="Enter budget"
          min="1"
          max={MAX_BUDGET}
          step="1"
          aria-invalid={Boolean(errors.budget)}
          {...register("budget")}
        />
        <FieldError error={errors.budget} />
      </FormField>

      <Button type="submit" className="mt-2 w-full">
        {isEditMode ? "Update Campaign" : "Create Campaign"}
      </Button>
    </form>
  );
}
