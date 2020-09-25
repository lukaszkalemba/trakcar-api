import { Request, Response } from 'express';
import Organization from 'models/Organization';
import User from 'models/User';

// @desc    Create new organization
// @route   POST /api/v1/organizations
// @access  Private
export const organizations_create_organization = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { name, accessCode } = req.body;

    const organizations = await Organization.find({ name });

    if (organizations.length) {
      return res.status(400).json({
        success: false,
        error: 'There is an organization with this name already',
      });
    }

    const organization = new Organization({
      name,
      accessCode,
      admin: req.user.id,
      members: [req.user.id],
    });

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const userOrganization = await Organization.findById(user.organization);

    if (userOrganization) {
      return res.status(400).json({
        success: false,
        error: 'You are a member of some organization already',
      });
    }

    user.organization = organization.id;

    await organization.save();
    await user.save();

    return res.status(201).json({
      success: true,
      data: organization,
    });
  } catch (err) {
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(
        ({ message }: any): string => message
      );

      return res.status(400).json({
        success: false,
        error: messages,
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Delete an organization
// @route   DELETE /api/v1/organizations/:id
// @access  Private
export const organizations_delete_organization = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    const organization = await Organization.findById(req.params.id);

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'No organization found',
      });
    }

    if (organization.admin.toString() !== req.user.id) {
      return res.status(400).json({
        success: false,
        error: 'You are not an administrator of this organization',
      });
    }

    await organization.remove();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};

// @desc    Assign new member to the organization
// @route   POST /api/v1/organizations/assign-member
// @access  Private
export const organizations_assign_member = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { accessCode } = req.body;

    const organization = await Organization.findOne({ accessCode });

    if (!organization) {
      return res.status(404).json({
        success: false,
        error: 'No organization found',
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid token',
      });
    }

    if (user.organization) {
      return res.status(400).json({
        success: false,
        error: 'You are a member of some organization already',
      });
    }

    organization.members.push(req.user.id);

    user.organization = organization.id;

    await organization.save();
    await user.save();

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: 'Server Error',
    });
  }
};
